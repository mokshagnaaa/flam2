"use client"
import React, { useMemo, useState } from 'react'
import { colors, buttonStyles, panelStyles } from '../../lib/styles'

export type ChartType = 'line' | 'bar' | 'scatter' | 'heatmap'

interface Category {
  id: string
  group?: string
  color?: string
  chartType?: ChartType
  chartOptions?: {
    line?: {
      strokeWidth?: number
      tension?: number
      fill?: boolean
    }
    bar?: {
      width?: number
      gap?: number
      stacked?: boolean
    }
    scatter?: {
      size?: number
      shape?: 'circle' | 'square' | 'triangle'
    }
    heatmap?: {
      cellSize?: number
      colorScale?: 'linear' | 'log'
    }
  }
}

export default function FilterPanel({
  categories,
  hidden,
  onToggle,
  onShowAll,
  onHideAll,
  onGroupToggle,
  onChartTypeChange,
  onChartOptionsChange
}: {
  categories: (string | Category)[]
  hidden: Set<string>
  onToggle: (cat: string) => void
  onShowAll?: () => void
  onHideAll?: () => void
  onGroupToggle?: (group: string, show: boolean) => void
  onChartTypeChange?: (cat: string, type: ChartType) => void
  onChartOptionsChange?: (cat: string, options: Category['chartOptions']) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const groupedCategories = useMemo(() => {
    const normalized = categories.map(c => 
      typeof c === 'string' ? { id: c } : c
    )
    
    const groups = normalized.reduce((acc, cat) => {
      const group = cat.group || 'Default'
      if (!acc[group]) acc[group] = []
      if (searchTerm && !cat.id.toLowerCase().includes(searchTerm.toLowerCase())) {
        return acc
      }
      acc[group].push(cat)
      return acc
    }, {} as Record<string, Category[]>)

    return Object.entries(groups).filter(([, cats]) => cats.length > 0)
  }, [categories, searchTerm])

  return (
    <div style={{ ...panelStyles }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 12 
      }}>
        <h4 style={{ margin: 0, color: colors.textAccent }}>Filters</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            onClick={() => onShowAll?.()}
            style={{ 
              ...buttonStyles.base,
              ...buttonStyles.small,
              backgroundColor: colors.bgSecondary
            }}
          >
            Show all
          </button>
          <button 
            onClick={() => onHideAll?.()}
            style={{ 
              ...buttonStyles.base,
              ...buttonStyles.small,
              backgroundColor: colors.bgSecondary
            }}
          >
            Hide all
          </button>
        </div>
      </div>

      <input
        type="search"
        placeholder="Search filters..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '6px 8px',
          marginBottom: 12,
          background: colors.bgPrimary,
          border: `1px solid ${colors.borderPrimary}`,
          borderRadius: 4,
          color: colors.textPrimary
        }}
      />

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 12,
        maxHeight: '300px',
        overflowY: 'auto',
        paddingRight: 8
      }}>
        {groupedCategories.map(([group, cats]) => (
          <div key={group}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
              color: '#94a3b8',
              fontSize: '0.9em'
            }}>
              <span>{group}</span>
              {onGroupToggle && (
                <div style={{ display: 'flex', gap: 4 }}>
                  <button 
                    onClick={() => onGroupToggle(group, true)}
                    style={{ padding: '2px 4px', fontSize: '0.8em' }}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => onGroupToggle(group, false)}
                    style={{ padding: '2px 4px', fontSize: '0.8em' }}
                  >
                    None
                  </button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {cats.map((cat) => (
                <label 
                  key={cat.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8,
                    padding: '4px 8px',
                    borderRadius: 4,
                    background: hidden.has(cat.id) ? colors.bgPrimary : colors.bgTertiary,
                    border: `1px solid ${hidden.has(cat.id) ? colors.borderPrimary : colors.borderSecondary}`
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={!hidden.has(cat.id)} 
                    onChange={() => onToggle(cat.id)} 
                  />
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <span style={{ 
                      color: hidden.has(cat.id) ? colors.textSecondary : colors.textPrimary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      flex: 1
                    }}>
                      {cat.color && (
                        <span style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: cat.color,
                          display: 'inline-block'
                        }} />
                      )}
                      {cat.id}
                    </span>

                    {onChartTypeChange && (
                      <select
                        value={(typeof cat === 'object' && cat.chartType) || 'line'}
                        onChange={(e) => onChartTypeChange(cat.id, e.target.value as ChartType)}
                        style={{
                          padding: '2px 4px',
                          background: colors.bgSecondary,
                          border: `1px solid ${colors.borderPrimary}`,
                          borderRadius: 4,
                          color: colors.textPrimary,
                          fontSize: '0.8em'
                        }}
                      >
                        <option value="line">Line</option>
                        <option value="bar">Bar</option>
                        <option value="scatter">Scatter</option>
                        <option value="heatmap">Heatmap</option>
                      </select>
                    )}

                    {onChartOptionsChange && typeof cat === 'object' && cat.chartType && (
                      <button
                        onClick={() => {
                          const type = cat.chartType!
                          let newOptions: Category['chartOptions'] = {}
                          
                          if (type === 'line') {
                            const lineOpts = cat.chartOptions?.line || {}
                            newOptions = {
                              line: {
                                strokeWidth: Number(prompt('Stroke width (px):', String(lineOpts.strokeWidth || 2))) || undefined,
                                tension: Number(prompt('Line tension (0-1):', String(lineOpts.tension || 0))) || undefined,
                                fill: confirm('Fill area under line?')
                              }
                            }
                          } else if (type === 'bar') {
                            const barOpts = cat.chartOptions?.bar || {}
                            newOptions = {
                              bar: {
                                width: Number(prompt('Bar width (px):', String(barOpts.width || 20))) || undefined,
                                gap: Number(prompt('Gap between bars (px):', String(barOpts.gap || 4))) || undefined,
                                stacked: confirm('Stack bars?')
                              }
                            }
                          } else if (type === 'scatter') {
                            const scatterOpts = cat.chartOptions?.scatter || {}
                            const shape = prompt('Shape (circle/square/triangle):', scatterOpts.shape || 'circle')
                            newOptions = {
                              scatter: {
                                size: Number(prompt('Point size (px):', String(scatterOpts.size || 6))) || undefined,
                                shape: (shape === 'circle' || shape === 'square' || shape === 'triangle') ? shape : undefined
                              }
                            }
                          } else if (type === 'heatmap') {
                            const heatmapOpts = cat.chartOptions?.heatmap || {}
                            const scale = prompt('Color scale (linear/log):', heatmapOpts.colorScale || 'linear')
                            newOptions = {
                              heatmap: {
                                cellSize: Number(prompt('Cell size (px):', String(heatmapOpts.cellSize || 20))) || undefined,
                                colorScale: (scale === 'linear' || scale === 'log') ? scale : undefined
                              }
                            }
                          }

                          // Filter out null/undefined values from prompts
                          if (newOptions.line && Object.values(newOptions.line).every(v => v === null || v === undefined)) {
                            delete newOptions.line
                          }
                          if (newOptions.bar && Object.values(newOptions.bar).every(v => v === null || v === undefined)) {
                            delete newOptions.bar
                          }
                          if (newOptions.scatter && Object.values(newOptions.scatter).every(v => v === null || v === undefined)) {
                            delete newOptions.scatter
                          }
                          if (newOptions.heatmap && Object.values(newOptions.heatmap).every(v => v === null || v === undefined)) {
                            delete newOptions.heatmap
                          }

                          if (Object.keys(newOptions).length > 0) {
                            onChartOptionsChange(cat.id, {
                              ...cat.chartOptions,
                              [type]: newOptions
                            })
                          }
                        }}
                        style={{
                          ...buttonStyles.base,
                          ...buttonStyles.small,
                          padding: '2px 6px',
                          fontSize: '0.7em'
                        }}
                      >
                        ⚙️
                      </button>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
