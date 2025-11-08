import type { DataPoint } from './dataGenerator'
import type { AggregationMethod, TimeWindow } from '../components/controls/AggregationControls'

export function aggregateData(
  data: DataPoint[],
  method: AggregationMethod,
  window: TimeWindow
): DataPoint[] {
  if (method === 'none' || !data.length) return data

  const result: DataPoint[] = []
  let currentWindow: DataPoint[] = []
  let windowStart = Math.floor(data[0].timestamp! / window) * window

  for (const point of data) {
    if (point.timestamp! >= windowStart + window) {
      if (currentWindow.length > 0) {
        result.push(aggregateWindow(currentWindow, method, windowStart))
      }
      windowStart = Math.floor(point.timestamp! / window) * window
      currentWindow = []
    }
    currentWindow.push(point)
  }

  if (currentWindow.length > 0) {
    result.push(aggregateWindow(currentWindow, method, windowStart))
  }

  return result
}

function aggregateWindow(
  points: DataPoint[],
  method: AggregationMethod,
  timestamp: number
): DataPoint {
  if (points.length === 0) throw new Error('Cannot aggregate empty window')

  let value: number
  switch (method) {
    case 'sum':
      value = points.reduce((sum, p) => sum + p.value, 0)
      break
    case 'average':
      value = points.reduce((sum, p) => sum + p.value, 0) / points.length
      break
    case 'min':
      value = Math.min(...points.map(p => p.value))
      break
    case 'max':
      value = Math.max(...points.map(p => p.value))
      break
    default:
      value = points[0].value
  }

  return {
    timestamp,
    value,
    category: points[0].category
  }
}