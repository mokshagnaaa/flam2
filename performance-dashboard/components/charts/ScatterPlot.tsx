"use client"
import React, { useMemo, useRef } from 'react'
import { useDataContext } from '../providers/DataProvider'
import type { DataPoint } from '../../lib/dataGenerator'
import { useChartRenderer } from '../../hooks/useChartRenderer'

export default function ScatterPlot({ overrideData }: { overrideData?: DataPoint[] } = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxData = useDataContext()
  const data = overrideData ?? ctxData.downsampled ?? ctxData.data

  const visible = useMemo(() => data.slice(-1000), [data])
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

  useChartRenderer(canvasRef, (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height)
    if (!visible.length) return
    ctx.fillStyle = '#34d399'
    const range = Math.max(1, stats.max - stats.min)
    for (let i = 0; i < visible.length; i++) {
      const p = visible[i]
      const x = (i / (visible.length - 1)) * width
      const y = (1 - (p.value - stats.min) / range) * height
      ctx.beginPath()
      ctx.arc(x, y, 1.2, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [visible, stats])

  return (
    <div style={{ width: '100%', height: 320, background: '#061828', borderRadius: 8 }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}
