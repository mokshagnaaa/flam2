"use client"
import React from 'react'
import { colors } from '../../lib/styles'

export default function PerformanceMonitor() {
  const [fps, setFps] = React.useState(0)
  const [memory, setMemory] = React.useState(0)

  React.useEffect(() => {
    let lastTime = performance.now()
    let frames = 0
    
    const measureFps = () => {
      const now = performance.now()
      frames++
      
      if (now >= lastTime + 1000) {
        setFps(Math.round((frames * 1000) / (now - lastTime)))
        frames = 0
        lastTime = now
        
        // Chrome only memory stats
        const perf = window.performance as any
        if (perf.memory) {
          setMemory(Math.round(perf.memory.usedJSHeapSize / 1024 / 1024))
        }
      }
      
      requestAnimationFrame(measureFps)
    }
    
    requestAnimationFrame(measureFps)
  }, [])

  return (
    <div style={{ 
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      fontSize: '0.875rem',
      color: colors.textSecondary
    }}>
      <div>
        FPS: <span style={{ color: fps < 30 ? colors.error : fps < 50 ? colors.warning : colors.success }}>{fps}</span>
      </div>
      {(window.performance as any).memory && (
        <div>
          Memory: <span style={{ color: memory > 100 ? colors.warning : colors.success }}>{memory} MB</span>
        </div>
      )}
    </div>
  )
}