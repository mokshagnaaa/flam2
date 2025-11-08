"use client"
import React, { useMemo, useRef, useState } from 'react'
import { useDataContext } from '../providers/DataProvider'
import type { DataPoint } from '../../lib/dataGenerator'
import { useChartRenderer } from '../../hooks/useChartRenderer'
import { ZoomState } from '../controls/ZoomControls'
import { AggregationMethod, TimeWindow } from '../controls/AggregationControls'
import { aggregateData } from '../../lib/aggregationUtils'

interface LineChartProps {
  overrideData?: DataPoint[]
  zoom?: ZoomState
  aggregation?: {
    method: AggregationMethod
    window: TimeWindow
  }
}

export default function LineChart({ 
  overrideData,
  zoom = { scale: 1, offset: 0 },
  aggregation = { method: 'none', window: 60000 }
}: LineChartProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxData = useDataContext()
  const data = overrideData ?? ctxData.downsampled ?? ctxData.data

  // Handle mouse interactions for pan/zoom
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; offset: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Process data with aggregation
  const aggregated = useMemo(() => 
    aggregateData(data, aggregation.method, aggregation.window),
    [data, aggregation.method, aggregation.window]
  )

  // Apply zoom and get visible window
  const visible = useMemo(() => {
    const now = Date.now()
    const visibleDuration = 2000 / zoom.scale // Base window of 2000ms adjusted by zoom
    const start = now - visibleDuration + zoom.offset
    return aggregated.filter(p => (p.timestamp ?? 0) >= start)
  }, [aggregated, zoom])

  const stats = useMemo(() => {
    if (!visible.length) return { min: 0, max: 1 }
    let min = Infinity
    let max = -Infinity
    for (let i = 0; i < visible.length; i++) {
      const v = visible[i].value
      if (v < min) min = v
      if (v > max) max = v
    }
    if (min === max) max = min + 1
    return { min, max }
  }, [visible])

  useChartRenderer(
    canvasRef,
    (ctx, width, height) => {
      ctx.clearRect(0, 0, width, height)
      if (visible.length <= 1) return

      // Draw grid
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 1
      
      // Vertical grid (time)
      const gridIntervalMinutes = zoom.scale <= 1 ? 1 : Math.ceil(zoom.scale / 2)
      const gridIntervalMs = gridIntervalMinutes * 60 * 1000
      const now = Date.now()
      const startTime = now - (2000 / zoom.scale) + zoom.offset
      const endTime = now + zoom.offset
      
      for (let t = Math.floor(startTime / gridIntervalMs) * gridIntervalMs; t <= endTime; t += gridIntervalMs) {
        const x = ((t - startTime) / (endTime - startTime)) * width
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      // Horizontal grid (values)
      const gridLines = 5
      for (let i = 0; i <= gridLines; i++) {
        const y = (i / gridLines) * height
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw data line
      ctx.lineWidth = 2
      ctx.strokeStyle = '#60a5fa'
      const range = Math.max(1, stats.max - stats.min)
      
      ctx.beginPath()
      for (let i = 0; i < visible.length; i++) {
        const p = visible[i]
        const x = ((p.timestamp! - startTime) / (endTime - startTime)) * width
        const y = (1 - (p.value - stats.min) / range) * height
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Draw time labels
      ctx.fillStyle = '#94a3b8'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      for (let t = Math.floor(startTime / gridIntervalMs) * gridIntervalMs; t <= endTime; t += gridIntervalMs) {
        const x = ((t - startTime) / (endTime - startTime)) * width
        const time = new Date(t)
        const label = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`
        ctx.fillText(label, x, height - 5)
      }

      // Draw value labels
      ctx.textAlign = 'right'
      for (let i = 0; i <= gridLines; i++) {
        const value = stats.min + (i / gridLines) * (stats.max - stats.min)
        const y = (1 - i / gridLines) * height
        ctx.fillText(value.toFixed(1), width - 5, y + 4)
      }
    },
    [visible, stats, zoom]
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    setIsDragging(true)
    setDragStart({ x, offset: zoom.offset })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const dx = x - dragStart.x
    const timeScale = (2000 / zoom.scale) / rect.width
    const newOffset = dragStart.offset - dx * timeScale
    if (zoom.offset !== newOffset) {
      zoom.offset = newOffset
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragStart(null)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return
    e.preventDefault()
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const xPct = x / rect.width

    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.max(1, Math.min(10, zoom.scale * scaleFactor))
    
    // Adjust offset to keep the mouse position fixed relative to the data
    const oldTimeWidth = 2000 / zoom.scale
    const newTimeWidth = 2000 / newScale
    const timeDiff = newTimeWidth - oldTimeWidth
    const newOffset = zoom.offset - timeDiff * xPct

    zoom.scale = newScale
    zoom.offset = newOffset
  }

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: 360, 
        background: '#071033', 
        borderRadius: 8,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}
