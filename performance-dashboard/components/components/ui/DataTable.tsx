"use client"
import React from 'react'
import { DataPoint } from '../../lib/chartTypes'
import { colors } from '../../lib/styles'

export default function DataTable({ data }: { data: DataPoint[] }) {
  return (
    <div style={{ 
      background: colors.bgSecondary, 
      borderRadius: '12px', 
      padding: '16px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h4 style={{ margin: 0, color: colors.textAccent }}>Data Table</h4>
        <span style={{ color: colors.textSecondary }}>{data.length} points</span>
      </div>

      <div style={{ 
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        <table style={{ 
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr>
              <th style={{ 
                textAlign: 'left', 
                padding: '8px',
                color: colors.textSecondary,
                borderBottom: `1px solid ${colors.borderPrimary}`
              }}>
                Time
              </th>
              <th style={{ 
                textAlign: 'left', 
                padding: '8px',
                color: colors.textSecondary,
                borderBottom: `1px solid ${colors.borderPrimary}`
              }}>
                Category
              </th>
              <th style={{ 
                textAlign: 'right', 
                padding: '8px',
                color: colors.textSecondary,
                borderBottom: `1px solid ${colors.borderPrimary}`
              }}>
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((point, i) => (
              <tr key={point.timestamp + '-' + i}>
                <td style={{ 
                  padding: '8px',
                  color: colors.textPrimary,
                  borderBottom: `1px solid ${colors.borderPrimary}`
                }}>
                  {new Date(point.timestamp).toLocaleTimeString()}
                </td>
                <td style={{ 
                  padding: '8px',
                  color: colors.textPrimary,
                  borderBottom: `1px solid ${colors.borderPrimary}`
                }}>
                  {point.category}
                </td>
                <td style={{ 
                  padding: '8px',
                  textAlign: 'right',
                  color: colors.textPrimary,
                  borderBottom: `1px solid ${colors.borderPrimary}`
                }}>
                  {point.value.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}