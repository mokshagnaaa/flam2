"use client"
import React, { useEffect, useRef } from 'react'
import { DataPoint } from '../../lib/chartTypes'
import { colors } from '../../lib/styles'
import { useDataContext } from '../providers/DataProvider'

export default function ScatterPlot() {
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
      
      visible.forEach((p: DataPoint, i: number) => {
        const x = (i / (visible.length - 1)) * canvas.offsetWidth
        const y = canvas.offsetHeight - ((p.value - min) / range) * (canvas.offsetHeight - 40) - 20
        
        ctx.fillStyle = p.color || colors.chartLine
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      })
    } catch (err) {
      console.error('Error rendering scatter plot:', err)
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