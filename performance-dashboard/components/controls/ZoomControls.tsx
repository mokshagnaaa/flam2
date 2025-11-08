"use client"
import React from 'react'

export interface ZoomState {
  scale: number
  offset: number
}

interface ZoomControlsProps {
  zoom: ZoomState
  onZoom: (newZoom: ZoomState) => void
  onReset: () => void
}

export default function ZoomControls({ zoom, onZoom, onReset }: ZoomControlsProps) {
  const handleZoomIn = () => {
    onZoom({ ...zoom, scale: zoom.scale * 1.2 })
  }

  const handleZoomOut = () => {
    onZoom({ ...zoom, scale: Math.max(1, zoom.scale / 1.2) })
  }

  const handlePanLeft = () => {
    onZoom({ ...zoom, offset: zoom.offset - (100 / zoom.scale) })
  }

  const handlePanRight = () => {
    onZoom({ ...zoom, offset: zoom.offset + (100 / zoom.scale) })
  }

  return (
    <div style={{ padding: 12, background: '#071033', borderRadius: 8, marginBottom: 12 }}>
      <h4 style={{ margin: '0 0 8px 0' }}>Zoom & Pan</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button 
          onClick={handleZoomIn} 
          style={{ padding: '6px 8px' }}
          title="Zoom In"
        >
          🔍+
        </button>
        <button 
          onClick={handleZoomOut} 
          style={{ padding: '6px 8px' }}
          title="Zoom Out"
        >
          🔍-
        </button>
        <button 
          onClick={handlePanLeft} 
          style={{ padding: '6px 8px' }}
          title="Pan Left"
        >
          ⬅️
        </button>
        <button 
          onClick={handlePanRight} 
          style={{ padding: '6px 8px' }}
          title="Pan Right"
        >
          ➡️
        </button>
        <button 
          onClick={onReset} 
          style={{ padding: '6px 8px' }}
          title="Reset View"
        >
          Reset
        </button>
      </div>
      <div style={{ 
        fontSize: '0.8em', 
        marginTop: 8, 
        color: '#94a3b8',
        display: 'flex',
        gap: 12 
      }}>
        <span>Scale: {zoom.scale.toFixed(2)}x</span>
        <span>Offset: {zoom.offset.toFixed(0)}ms</span>
      </div>
    </div>
  )
}