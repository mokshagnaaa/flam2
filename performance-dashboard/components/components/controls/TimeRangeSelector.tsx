"use client"
import React from 'react'
import { colors, buttonStyles } from '../../lib/styles'

export default function TimeRangeSelector() {
  return (
    <div style={{ 
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }}>
      <button 
        style={{
          ...buttonStyles.base,
          ...buttonStyles.small,
          backgroundColor: colors.bgSecondary,
          color: colors.textPrimary
        }}
      >
        1h
      </button>
      <button 
        style={{
          ...buttonStyles.base,
          ...buttonStyles.small,
          backgroundColor: colors.bgAccent,
          color: colors.textPrimary
        }}
      >
        24h
      </button>
      <button 
        style={{
          ...buttonStyles.base,
          ...buttonStyles.small,
          backgroundColor: colors.bgSecondary,
          color: colors.textPrimary
        }}
      >
        7d
      </button>
    </div>
  )
}