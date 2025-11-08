"use client"
import React, { useMemo, useState } from 'react'
import DataProvider from '../providers/DataProvider'
import { colors, buttonStyles, panelStyles } from '../../lib/styles'
import LineChart from '../charts/LineChart'
import BarChart from '../charts/BarChart'
import ScatterPlot from '../charts/ScatterPlot'
import Heatmap from '../charts/Heatmap'
import { useDataStream } from '../../hooks/useDataStream'
import PerformanceMonitor from '../ui/PerformanceMonitor'
import FilterPanel from '../controls/FilterPanel'
import TimeRangeSelector from '../controls/TimeRangeSelector'
import DataTable from '../ui/DataTable'
import { useDataContext } from '../providers/DataProvider'
import type { DataPoint } from '../../lib/dataGenerator'
import ZoomControls, { ZoomState } from '../controls/ZoomControls'
import AggregationControls, { AggregationMethod, TimeWindow } from '../controls/AggregationControls'

export default function DashboardShell({ initialData }: { initialData: DataPoint[] }) {
  return (
    <DataProvider initialData={initialData}>
      <ShellInner />
    </DataProvider>
  )
}

function ShellInner() {
  // start streaming into provider
  useDataStream(100)

  // local controls
  const { data } = useDataContext()
  const [timeRange, setTimeRange] = useState<number>(5 * 60 * 1000)
  const [hiddenCats, setHiddenCats] = useState<Set<string>>(new Set())
  const [streaming, setStreaming] = useState(true)
  const [rateMs, setRateMs] = useState<number>(100)
  const [zoom, setZoom] = useState<ZoomState>({ scale: 1, offset: 0 })
  const [aggregation, setAggregation] = useState<{ method: AggregationMethod, window: TimeWindow }>({
    method: 'none',
    window: 60000
  })

  const categories = useMemo(() => Array.from(new Set(data.map((d) => d.category ?? 'unknown'))), [data])

  const toggleCat = (c: string) => {
    setHiddenCats((s) => {
      const next = new Set(s)
      if (next.has(c)) next.delete(c)
      else next.add(c)
      return next
    })
  }

  const showAll = () => setHiddenCats(new Set())
  const hideAll = () => setHiddenCats(new Set(categories))

  const cutoff = timeRange === Infinity ? -Infinity : Date.now() - timeRange
  const filtered = useMemo(() => data.filter((d) => (d.timestamp ?? 0) >= cutoff && !hiddenCats.has(d.category ?? '')), [data, cutoff, hiddenCats])

  useDataStream(rateMs, streaming)

  return (
    <div 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 360px', 
        gap: '24px',
        padding: '24px',
        minHeight: '100vh',
        background: colors.bgPrimary,
        color: colors.textPrimary
      }}
    >
      <main>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Performance Stats Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '8px'
          }}>
            <div style={{
              ...panelStyles,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}>
              <PerformanceMonitor />
            </div>
          </div>

          {/* Main Chart */}
          <div style={{
            ...panelStyles,
            padding: '20px',
            borderColor: colors.borderAccent,
          }}>
            <LineChart 
              overrideData={filtered}
              zoom={zoom}
              aggregation={aggregation}
            />
          </div>

          {/* Secondary Charts */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '24px'
          }}>
            <div style={panelStyles}>
              <BarChart overrideData={filtered} />
            </div>
            <div style={panelStyles}>
              <ScatterPlot overrideData={filtered} />
            </div>
          </div>

          {/* Heatmap */}
          <div style={panelStyles}>
            <Heatmap overrideData={filtered} />
          </div>

          {/* Data Table */}
          <div style={{
            ...panelStyles,
            overflow: 'hidden'
          }}>
            <DataTable data={filtered.slice().reverse()} height={360} />
          </div>
        </div>
      </main>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Stream Controls */}
        <div style={{
          ...panelStyles,
          background: colors.bgSecondary,
        }}>
          <h4 style={{ 
            margin: '0 0 16px 0',
            fontSize: '1.1rem',
            fontWeight: 500,
            color: colors.textAccent
          }}>
            Stream Controls
          </h4>
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginBottom: '16px',
            alignItems: 'center' 
          }}>
            <button 
              onClick={() => setStreaming((s) => !s)} 
              style={{
                ...buttonStyles.base,
                ...(streaming ? {
                  backgroundColor: colors.error,
                  color: colors.textPrimary,
                } : {
                  backgroundColor: colors.success,
                  color: colors.textPrimary,
                })
              }}
            >
              {streaming ? '⏸ Pause' : '▶️ Start'}
            </button>
            <button 
              onClick={() => { setRateMs(10); }}
              style={{
                ...buttonStyles.base,
                backgroundColor: colors.warning,
                color: colors.textPrimary,
              }}
            >
              ⚡ Stress Test
            </button>
          </div>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label style={{ 
              color: colors.textSecondary,
              fontSize: '0.9rem'
            }}>
              Update Rate
            </label>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              alignItems: 'center' 
            }}>
              <input 
                type="range" 
                min={10} 
                max={1000} 
                value={rateMs} 
                onChange={(e) => setRateMs(Number(e.target.value))}
                style={{
                  flex: 1,
                  accentColor: colors.bgAccent
                }}
              />
              <div style={{ 
                minWidth: '60px',
                textAlign: 'right',
                color: colors.textAccent,
                fontFamily: 'monospace'
              }}>
                {rateMs}ms
              </div>
            </div>
          </div>
        </div>

        <ZoomControls 
          zoom={zoom}
          onZoom={setZoom}
          onReset={() => setZoom({ scale: 1, offset: 0 })}
        />
        <TimeRangeSelector 
          value={timeRange} 
          onChange={setTimeRange}
          onCustomRange={(start, end) => {
            const range = end - start
            setTimeRange(range)
            const now = Date.now()
            setZoom({ scale: 1, offset: now - end })
          }}
        />
        <AggregationControls
          method={aggregation.method}
          window={aggregation.window}
          onMethodChange={(method) => setAggregation(prev => ({ ...prev, method }))}
          onWindowChange={(window) => setAggregation(prev => ({ ...prev, window }))}
        />
        <FilterPanel 
          categories={categories.map(c => ({
            id: c,
            group: c.split('.')[0],
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
          }))}
          hidden={hiddenCats} 
          onToggle={toggleCat} 
          onShowAll={showAll} 
          onHideAll={hideAll}
          onGroupToggle={(group, show) => {
            const groupCats = categories.filter(c => c.split('.')[0] === group)
            if (show) {
              setHiddenCats(prev => {
                const next = new Set(prev)
                groupCats.forEach(c => next.delete(c))
                return next
              })
            } else {
              setHiddenCats(prev => {
                const next = new Set(prev)
                groupCats.forEach(c => next.add(c))
                return next
              })
            }
          }}
        />
        <div style={{ marginTop: 12 }}>
          <PerformanceMonitor />
        </div>
      </aside>
    </div>
  )
}
