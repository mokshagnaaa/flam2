"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import type { DataPoint } from '../../lib/chartTypes'

interface DataContextType {
  data: DataPoint[]
  hidden: Set<string>
  toggleCategory: (cat: string) => void
  showAllCategories: () => void
  hideAllCategories: () => void
  toggleGroup: (group: string, show: boolean) => void
}

const DataContext = createContext<DataContextType>({
  data: [],
  hidden: new Set(),
  toggleCategory: () => {},
  showAllCategories: () => {},
  hideAllCategories: () => {},
  toggleGroup: () => {}
})

export function useDataContext() {
  return useContext(DataContext)
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DataPoint[]>([])
  const [hidden, setHidden] = useState(new Set<string>())

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch('/api/data')
      const points = await res.json()
      setData(points)
    }
    loadData()

    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  const toggleCategory = (cat: string) => {
    setHidden(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const showAllCategories = () => setHidden(new Set())
  const hideAllCategories = () => setHidden(new Set(data.map(d => d.category || 'unknown')))

  const toggleGroup = (group: string, show: boolean) => {
    setHidden(prev => {
      const next = new Set(prev)
      data.forEach(d => {
        const cat = d.category || 'unknown'
        if (cat.startsWith(group)) {
          if (show) next.delete(cat)
          else next.add(cat)
        }
      })
      return next
    })
  }

  return (
    <DataContext.Provider value={{ 
      data, 
      hidden, 
      toggleCategory,
      showAllCategories,
      hideAllCategories,
      toggleGroup
    }}>
      {children}
    </DataContext.Provider>
  )
}