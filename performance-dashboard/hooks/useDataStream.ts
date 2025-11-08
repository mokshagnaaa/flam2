"use client"
import { useEffect } from 'react'
import type { DataPoint } from '../lib/dataGenerator'
import { useDataContext } from '../components/providers/DataProvider'

export function useDataStream(rateMs = 100, enabled = true) {
  const { push } = useDataContext()

  useEffect(() => {
    if (!enabled) return

    const id = setInterval(() => {
      const point: DataPoint = {
        timestamp: Date.now(),
        value: Math.random() * 100 - 50,
        category: `stream-${Math.floor(Math.random() * 4)}`
      }
      push(point)
    }, rateMs)

    return () => clearInterval(id)
  }, [rateMs, push, enabled])
}
