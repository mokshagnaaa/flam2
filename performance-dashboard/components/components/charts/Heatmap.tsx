"use client"
import React, { useEffect, useRef } from 'react'
import { DataPoint } from '../../lib/chartTypes'
import { colors } from '../../lib/styles'
import { useDataContext } from '../providers/DataProvider'

export default function Heatmap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { data, hidden } = useDataContext()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    ctx.translate(0.5, 0.5)

    const visible = data.filter((d: DataPoint) => !hidden.has(d.category || 'unknown'))
    if (!visible.length) return

    try {
      const min = Math.min(...visible.map((d: DataPoint) => d.value))
      const max = Math.max(...visible.map((d: DataPoint) => d.value))
      const range = max - min
      
      const cellSize = 20
      const cols = Math.floor(canvas.offsetWidth / cellSize)
      const rows = Math.floor((canvas.offsetHeight - 40) / cellSize)

      visible.forEach((p: DataPoint, i: number) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        if (row >= rows) return

        const intensity = (p.value - min) / range
        ctx.fillStyle = `hsla(200, 70%, 50%, ${intensity})`
        ctx.fillRect(
          col * cellSize,
          row * cellSize + 20,
          cellSize - 1,
          cellSize - 1
        )
      })
    } catch (err) {
      console.error('Error rendering heatmap:', err)
    }
  }, [data, hidden])

  return (
    <div style={{ 
      width: '100%', 
      height: 240, 
      background: colors.bgPrimary, 
      borderRadius: 8 
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}