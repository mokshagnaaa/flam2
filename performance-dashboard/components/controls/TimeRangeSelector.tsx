"use client"
import React, { useMemo, useState, useEffect } from 'react'
import { colors, buttonStyles, panelStyles } from '../../lib/styles'

const TIME_RANGES = [
  { label: '30s', value: 30 * 1000 },
  { label: '1m', value: 60 * 1000 },
  { label: '5m', value: 5 * 60 * 1000 },
  { label: '15m', value: 15 * 60 * 1000 },
  { label: '30m', value: 30 * 60 * 1000 },
  { label: '1h', value: 60 * 60 * 1000 },
  { label: '4h', value: 4 * 60 * 60 * 1000 },
  { label: '1d', value: 24 * 60 * 60 * 1000 },
  { label: 'All', value: Infinity }
]

export default function TimeRangeSelector({ 
  value, 
  onChange,
  onCustomRange
}: { 
  value: number
  onChange: (ms: number) => void
  onCustomRange?: (start: number, end: number) => void
}) {
  const [customMode, setCustomMode] = useState(false)
  const [range, setRange] = useState({
    start: new Date(Date.now() - value),
    end: new Date()
  })

  const activeRange = useMemo(() => 
    TIME_RANGES.find(r => r.value === value) || TIME_RANGES[0], 
    [value]
  )

  useEffect(() => {
    if (!customMode) {
      setRange({
        start: new Date(Date.now() - value),
        end: new Date()
      })
    }
  }, [value, customMode])

  const formatDateTime = (date: Date) => {
    return date.toISOString().slice(0, 16) // Format as YYYY-MM-DDTHH:mm
  }

  return (
    <div style={{ ...panelStyles, background: colors.bgSecondary }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h4 style={{ 
          margin: 0,
          fontSize: '1.1rem',
          fontWeight: 500,
          color: colors.textAccent 
        }}>
          Time Range
        </h4>
        <button
          onClick={() => setCustomMode(!customMode)}
          style={{
            ...buttonStyles.base,
            ...buttonStyles.small,
            backgroundColor: customMode ? colors.bgAccent : colors.bgSecondary,
            borderColor: customMode ? colors.borderAccent : colors.borderPrimary,
            color: customMode ? colors.textPrimary : colors.textSecondary,
          }}
        >
          {customMode ? '⚡ Live Mode' : '📅 Custom Range'}
        </button>
      </div>

      {!customMode ? (
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          flexWrap: 'wrap', 
          marginBottom: '16px'
        }}>
          {TIME_RANGES.map(range => (
            <button
              key={range.label}
              onClick={() => onChange(range.value)}
              style={{ 
                ...buttonStyles.base,
                ...buttonStyles.small,
                backgroundColor: range.value === activeRange.value ? colors.bgAccent : colors.bgSecondary,
                borderColor: range.value === activeRange.value ? colors.borderAccent : colors.borderPrimary,
                color: range.value === activeRange.value ? colors.textPrimary : colors.textSecondary,
                fontWeight: range.value === activeRange.value ? 600 : 400,
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ 
          background: colors.bgPrimary,
          border: `1px solid ${colors.borderPrimary}`,
          borderRadius: '8px',
          padding: '16px'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '12px',
              alignItems: 'center'
            }}>
              <label style={{ 
                color: colors.textSecondary,
                fontSize: '0.9rem',
                width: '45px'
              }}>From:</label>
              <input 
                type="datetime-local" 
                value={formatDateTime(range.start)}
                onChange={(e) => {
                  const start = new Date(e.target.value)
                  setRange(prev => ({ ...prev, start }))
                  if (onCustomRange) onCustomRange(start.getTime(), range.end.getTime())
                }}
                style={{ 
                  padding: '8px 12px',
                  background: colors.bgSecondary,
                  border: `1px solid ${colors.borderPrimary}`,
                  borderRadius: '4px',
                  color: colors.textPrimary,
                  width: '100%'
                }}
              />
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '12px',
              alignItems: 'center'
            }}>
              <label style={{ 
                color: colors.textSecondary,
                fontSize: '0.9rem',
                width: '45px'
              }}>To:</label>
              <input 
                type="datetime-local"
                value={formatDateTime(range.end)}
                onChange={(e) => {
                  const end = new Date(e.target.value)
                  setRange(prev => ({ ...prev, end }))
                  if (onCustomRange) onCustomRange(range.start.getTime(), end.getTime())
                }}
                style={{ 
                  padding: '8px 12px',
                  background: colors.bgSecondary,
                  border: `1px solid ${colors.borderPrimary}`,
                  borderRadius: '4px',
                  color: colors.textPrimary,
                  width: '100%'
                }}
              />
            </div>
            
            <div style={{
              marginTop: '4px',
              padding: '8px',
              background: colors.bgSecondary,
              border: `1px solid ${colors.borderPrimary}`,
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: colors.textSecondary,
                marginBottom: '4px'
              }}>
                <span>Range:</span>
                <span style={{ color: colors.textAccent }}>
                  {Math.round((range.end.getTime() - range.start.getTime()) / 1000)} seconds
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: colors.textSecondary
              }}>
                <span>Data points:</span>
                <span style={{ color: colors.textAccent }}>
                  {Math.round((range.end.getTime() - range.start.getTime()) / 100)} points
                </span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '4px'
            }}>
              <button
                onClick={() => {
                  const now = new Date()
                  const start = new Date(now.getTime() - 60000) // 1 minute ago
                  setRange({ start, end: now })
                  if (onCustomRange) onCustomRange(start.getTime(), now.getTime())
                }}
                style={{
                  ...buttonStyles.base,
                  ...buttonStyles.small,
                  flex: 1,
                  backgroundColor: colors.bgSecondary
                }}
              >
                Last Minute
              </button>
              <button
                onClick={() => {
                  const now = new Date()
                  const start = new Date(now.getTime() - 3600000) // 1 hour ago
                  setRange({ start, end: now })
                  if (onCustomRange) onCustomRange(start.getTime(), now.getTime())
                }}
                style={{
                  ...buttonStyles.base,
                  ...buttonStyles.small,
                  flex: 1,
                  backgroundColor: colors.bgSecondary
                }}
              >
                Last Hour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
