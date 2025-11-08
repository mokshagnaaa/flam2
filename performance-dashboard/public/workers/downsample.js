// Simple LTTB downsampling implementation in plain JS for the worker.
// Expects messages: { type: 'downsample', id, data: [{timestamp, value}], threshold }
// Posts back: { type: 'result', id, data }

function largestTriangleThreeBuckets(data, threshold) {
  if (!data || data.length === 0 || threshold >= data.length) return data.slice()

  const sampled = []
  const every = (data.length - 2) / (threshold - 2)
  let a = 0 // initially a is the first point in the triangle
  sampled.push(data[a])

  for (let i = 0; i < threshold - 2; i++) {
    const avgRangeStart = Math.floor((i + 1) * every) + 1
    const avgRangeEnd = Math.floor((i + 2) * every) + 1
    const avgRangeEndIndex = Math.min(avgRangeEnd, data.length)

    let avgX = 0
    let avgY = 0
    const avgRangeLength = avgRangeEndIndex - avgRangeStart
    for (let j = avgRangeStart; j < avgRangeEndIndex; j++) {
      avgX += data[j].timestamp
      avgY += data[j].value
    }
    avgX /= Math.max(1, avgRangeLength)
    avgY /= Math.max(1, avgRangeLength)

    const rangeOffs = Math.floor(i * every) + 1
    const rangeTo = Math.floor((i + 1) * every) + 1

    const pointAx = data[a].timestamp
    const pointAy = data[a].value

    let maxArea = -1
    let nextA = rangeOffs

    for (let j = rangeOffs; j < rangeTo; j++) {
      const area = Math.abs(
        (pointAx - avgX) * (data[j].value - pointAy) - (pointAx - data[j].timestamp) * (avgY - pointAy)
      ) * 0.5

      if (area > maxArea) {
        maxArea = area
        nextA = j
      }
    }

    sampled.push(data[nextA])
    a = nextA
  }

  sampled.push(data[data.length - 1])
  return sampled
}

self.addEventListener('message', (e) => {
  const msg = e.data
  if (!msg || msg.type !== 'downsample') return
  const { id, data, threshold = 1000 } = msg
  try {
    // ensure data sorted by timestamp
    const d = data.slice().sort((a, b) => a.timestamp - b.timestamp)
    const out = largestTriangleThreeBuckets(d, Math.max(3, threshold))
    self.postMessage({ type: 'result', id, data: out })
  } catch (err) {
    self.postMessage({ type: 'error', id, message: String(err) })
  }
})
