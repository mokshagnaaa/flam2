"use client"
import React, { useEffect, useRef } from 'react'
import { DataPoint } from '../../lib/chartTypes'
import { colors } from '../../lib/styles'
import { useDataContext } from '../providers/DataProvider'

export default function LineChart() {
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
      
      ctx.lineWidth = 2
      ctx.strokeStyle = colors.chartLine

      const categories = new Map<string, DataPoint[]>()
      visible.forEach((p: DataPoint) => {
        const cat = p.category || 'unknown'
        const points = categories.get(cat) || []
        points.push(p)
        categories.set(cat, points)
      })

      categories.forEach((points, cat) => {
        points.sort((a, b) => a.timestamp - b.timestamp)
        
        ctx.beginPath()
        points.forEach((p, i) => {
          const x = (i / (points.length - 1)) * canvas.offsetWidth
          const y = canvas.offsetHeight - ((p.value - min) / range) * (canvas.offsetHeight - 40) - 20
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.stroke()
      })
    } catch (err) {
      console.error('Error rendering line chart:', err)
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