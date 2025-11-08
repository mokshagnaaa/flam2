"use client"
import React, { useMemo, useRef } from 'react'
import { useDataContext } from '../providers/DataProvider'
import type { DataPoint } from '../../lib/dataGenerator'
import { useChartRenderer } from '../../hooks/useChartRenderer'

export default function BarChart({ overrideData }: { overrideData?: DataPoint[] } = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxData = useDataContext()
  const data = overrideData ?? ctxData.downsampled ?? ctxData.data

  const visible = useMemo(() => data.slice(-50), [data])
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
    ctx.fillStyle = '#fb923c'
    const barW = width / Math.max(1, visible.length)
    const range = Math.max(1, stats.max - stats.min)
    for (let i = 0; i < visible.length; i++) {
      const p = visible[i]
      const x = i * barW
      const hPct = (p.value - stats.min) / range
      const bh = hPct * height
      ctx.fillRect(x, height - bh, barW * 0.8, bh)
    }
  }, [visible, stats])

  return (
    <div style={{ width: '100%', height: 240, background: '#061826', borderRadius: 8 }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}
