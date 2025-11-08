"use client"
import { useEffect, useRef, useState } from 'react'

export type PerformanceMetrics = {
  fps: number
  memory?: {
    jsHeapSizeLimit: number
    totalJSHeapSize: number
    usedJSHeapSize: number
  }
}

export function usePerformanceMonitor(sampleInterval = 1000) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ fps: 0 })
  const rafRef = useRef<number | null>(null)
  const frames = useRef(0)
  const last = useRef(performance.now())

  useEffect(() => {
    const tick = () => {
      frames.current++
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    const id = setInterval(() => {
      const now = performance.now()
      const delta = now - last.current
      const fps = Math.round((frames.current * 1000) / Math.max(1, delta))
      frames.current = 0
      last.current = now

      const mem = (performance as any).memory
      setMetrics({ fps, memory: mem ? { ...mem } : undefined })
    }, sampleInterval)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearInterval(id)
    }
  }, [sampleInterval])

  return metrics
}
