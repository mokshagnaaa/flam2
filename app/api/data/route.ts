export async function GET() {
  const now = Date.now()
  const points = []
  const categories = ['cpu', 'memory', 'disk', 'network']
  
  // Generate 1000 data points
  for (let i = 0; i < 1000; i++) {
    const timestamp = now - (1000 - i) * 1000 // Last 1000 seconds
    const category = categories[Math.floor(Math.random() * categories.length)]
    
    points.push({
      timestamp,
      value: Math.random() * 100,
      category
    })
  }

  return Response.json(points)
}