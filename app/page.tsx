"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import DataProvider from '../performance-dashboard/components/providers/DataProvider'
import { DataPoint } from '../performance-dashboard/lib/chartTypes'

const initialData: DataPoint[] = new Array(1000).fill(0).map((_, i) => ({
  timestamp: Date.now() - (1000 - i) * 1000,
  value: Math.random() * 100,
  category: ['cpu', 'memory', 'disk', 'network'][Math.floor(Math.random() * 4)]
}))

const DashboardShell = dynamic(() => import('../performance-dashboard/components/dashboard/DashboardShell'), {
  ssr: false
})

export default function Page() {
  return (
    <DataProvider initialData={initialData}>
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardShell initialData={initialData} />
      </Suspense>
    </DataProvider>
  )
}