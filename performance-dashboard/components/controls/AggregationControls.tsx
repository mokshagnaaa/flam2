"use client"
import React from 'react'

export type AggregationMethod = 'none' | 'sum' | 'average' | 'min' | 'max'
export type TimeWindow = 60000 | 300000 | 3600000 // 1min, 5min, 1hour in ms

interface AggregationControlsProps {
  method: AggregationMethod
  window: TimeWindow
  onMethodChange: (method: AggregationMethod) => void
  onWindowChange: (window: TimeWindow) => void
}

const METHODS: { label: string; value: AggregationMethod }[] = [
  { label: 'Raw', value: 'none' },
  { label: 'Sum', value: 'sum' },
  { label: 'Average', value: 'average' },
  { label: 'Min', value: 'min' },
  { label: 'Max', value: 'max' }
]

const WINDOWS: { label: string; value: TimeWindow }[] = [
  { label: '1 min', value: 60000 },
  { label: '5 min', value: 300000 },
  { label: '1 hour', value: 3600000 }
]

export default function AggregationControls({
  method,
  window,
  onMethodChange,
  onWindowChange
}: AggregationControlsProps) {
  return (
    <div style={{ padding: 12, background: '#071033', borderRadius: 8, marginBottom: 12 }}>
      <h4 style={{ margin: '0 0 8px 0' }}>Data Aggregation</h4>
      
      <div style={{ marginBottom: 8 }}>
        <div style={{ color: '#94a3b8', fontSize: '0.9em', marginBottom: 4 }}>Method</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {METHODS.map(m => (
            <button
              key={m.value}
              onClick={() => onMethodChange(m.value)}
              style={{ 
                padding: '6px 8px',
                background: method === m.value ? '#1e40af' : undefined,
                borderColor: method === m.value ? '#60a5fa' : undefined
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {method !== 'none' && (
        <div>
          <div style={{ color: '#94a3b8', fontSize: '0.9em', marginBottom: 4 }}>Time Window</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {WINDOWS.map(w => (
              <button
                key={w.value}
                onClick={() => onWindowChange(w.value)}
                style={{ 
                  padding: '6px 8px',
                  background: window === w.value ? '#1e40af' : undefined,
                  borderColor: window === w.value ? '#60a5fa' : undefined
                }}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}