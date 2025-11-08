"use client"
import React, { useMemo, useRef } from 'react'
import { useDataContext } from '../providers/DataProvider'
import type { DataPoint } from '../../lib/dataGenerator'
import { useChartRenderer } from '../../hooks/useChartRenderer'

export default function Heatmap({ overrideData }: { overrideData?: DataPoint[] } = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxData = useDataContext()
  const data = overrideData ?? ctxData.downsampled ?? ctxData.data

  const visible = useMemo(() => data.slice(-2000), [data])

  useChartRenderer(
    canvasRef,
    (ctx, width, height) => {
      ctx.clearRect(0, 0, width, height)
      if (!visible.length) return

      const cols = 200
      const rows = Math.ceil(visible.length / cols)
      const cellW = width / cols
      const cellH = height / Math.max(1, rows)

      let min = Infinity
      let max = -Infinity
      for (let i = 0; i < visible.length; i++) {
        const v = visible[i].value
        if (v < min) min = v
        if (v > max) max = v
      }
      if (min === max) max = min + 1
      const range = Math.max(1, max - min)

      for (let i = 0; i < visible.length; i++) {
        const v = visible[i]
        const col = i % cols
        const row = Math.floor(i / cols)
        const t = (v.value - min) / range
        const r = Math.round(255 * t)
        const g = Math.round(80 + 175 * (1 - t))
        ctx.fillStyle = `rgb(${r},${g},60)`
        ctx.fillRect(col * cellW, row * cellH, cellW, cellH)
      }
    },
    [visible]
  )

  return (
    <div style={{ width: '100%', height: 240, background: '#000814', borderRadius: 8 }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}
