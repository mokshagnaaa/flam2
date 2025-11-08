"use client"
import React from 'react'
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor'

export default function PerformanceMonitor() {
  const m = usePerformanceMonitor(500)

  return (
    <div style={{ padding: 12, background: '#071033', borderRadius: 8 }}>
      <h4 style={{ margin: '0 0 8px 0' }}>Performance</h4>
      <div>FPS: <strong>{m.fps}</strong></div>
      <div>Memory: {m.memory ? Math.round(m.memory.usedJSHeapSize / 1024 / 1024) + ' MB' : 'N/A'}</div>
    </div>
  )
}
