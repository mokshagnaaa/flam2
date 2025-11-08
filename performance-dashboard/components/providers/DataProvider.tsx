"use client"
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { DataPoint } from '../../lib/dataGenerator'

type DataContextValue = {
  data: DataPoint[]
  downsampled?: DataPoint[]
  push: (d: DataPoint) => void
  requestDownsample: (threshold: number) => void
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

interface Props {
  children: React.ReactNode
  initialData: DataPoint[]
}

export default function DataProvider({ children, initialData }: Props) {
  const [data, setData] = useState<DataPoint[]>(initialData)
  const [downsampled, setDownsampled] = useState<DataPoint[] | undefined>(undefined)
  const workerRef = useRef<Worker | null>(null)
  const pendingRef = useRef<number | null>(null)

  useEffect(() => {
    // instantiate worker from public folder
    try {
      workerRef.current = new Worker('/workers/downsample.js')
      workerRef.current.onmessage = (e) => {
        const msg = e.data
        if (!msg) return
        if (msg.type === 'result') {
          setDownsampled(msg.data)
        }
      }
    } catch (err) {
      // worker not available
      console.warn('Worker not available:', err)
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [])

  const scheduleDownsample = (threshold = 2000) => {
    if (!workerRef.current) return
    if (pendingRef.current) clearTimeout(pendingRef.current)
    // throttle updates to avoid flooding the worker
    pendingRef.current = window.setTimeout(() => {
      pendingRef.current = null
      // send a lightweight copy (timestamps and values) to the worker
      const payload = data.map((d) => ({ timestamp: d.timestamp, value: d.value }))
      workerRef.current!.postMessage({ type: 'downsample', id: Date.now(), data: payload, threshold })
    }, 120)
  }

  const push = (d: DataPoint) => setData((s) => {
    const next = s.length > 200000 ? s.slice(s.length - 200000 + 1) : s.slice()
    next.push(d)
    // schedule background downsampling at a reasonable threshold
    // smaller threshold when data grows large
    const threshold = Math.min(2000, Math.max(200, Math.floor(next.length / 10)))
    scheduleDownsample(threshold)
    return next
  })

  const requestDownsample = (threshold: number) => scheduleDownsample(threshold)

  return <DataContext.Provider value={{ data, downsampled, push, requestDownsample }}>{children}</DataContext.Provider>
}

export function useDataContext() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useDataContext must be used inside DataProvider')
  return ctx
}
