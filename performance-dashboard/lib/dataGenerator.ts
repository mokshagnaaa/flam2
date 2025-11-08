export type DataPoint = {
  timestamp: number
  value: number
  category?: string
}

export function generateInitialDataset(count = 10000): DataPoint[] {
  const now = Date.now()
  const out: DataPoint[] = new Array(count)

  for (let i = 0; i < count; i++) {
    out[i] = {
      timestamp: now - (count - i) * 1000,
      value: Math.sin(i / 50) * 50 + Math.random() * 10,
      category: `series-${i % 4}`
    }
  }

  return out
}
