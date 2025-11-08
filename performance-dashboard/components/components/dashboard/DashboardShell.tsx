"use client"
import React, { useMemo } from 'react'
import { useDataContext } from '../providers/DataProvider'
import { DataPoint } from '../../lib/chartTypes'
import LineChart from '../charts/LineChart'
import BarChart from '../charts/BarChart'
import ScatterPlot from '../charts/ScatterPlot'
import Heatmap from '../charts/Heatmap'
import FilterPanel from '../controls/FilterPanel'
import TimeRangeSelector from '../controls/TimeRangeSelector'
import DataTable from '../ui/DataTable'
import PerformanceMonitor from '../ui/PerformanceMonitor'
import { colors } from '../../lib/styles'

interface Props {
  initialData?: DataPoint[]
}

export default function DashboardShell({ initialData = [] }: Props) {
  const { data } = useDataContext()

  const chartStyle = {
    width: '100%',
    height: 240,
    background: colors.bgPrimary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  }

  const categories = useMemo(() => {
    const cats = new Set<string>()
    data.forEach(d => cats.add(d.category || 'unknown'))
    return Array.from(cats)
  }, [data])

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: 24,
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: 24,
      height: '100vh'
    }}>
      <div>
        <FilterPanel />
      </div>
      <div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <TimeRangeSelector />
          <PerformanceMonitor />
        </div>
        
        <div style={chartStyle}>
          <LineChart />
        </div>
        <div style={chartStyle}>
          <BarChart />
        </div>
        <div style={chartStyle}>
          <ScatterPlot />
        </div>
        <div style={chartStyle}>
          <Heatmap />
        </div>
        
        <DataTable data={data} />
      </div>
    </div>
  )
}