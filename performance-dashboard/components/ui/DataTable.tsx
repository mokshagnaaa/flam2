"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { computeWindow } from '../../hooks/useVirtualization'
import type { DataPoint } from '../../lib/dataGenerator'
import { colors } from '../../lib/styles'

type FlatItem = { type: 'group'; key: string } | { type: 'row'; item: DataPoint }

export default function DataTable({ data, height = 400, rowHeight = 32 }: { data: DataPoint[]; height?: number; rowHeight?: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [search, setSearch] = useState('')
  const [groupBy, setGroupBy] = useState(false)
  const [sortBy, setSortBy] = useState<'timestamp' | 'value' | 'category'>('timestamp')
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')

  // simple filtering by search term (timestamp text, value, category)
  const filtered = useMemo(() => {
    if (!search) return data
    const q = search.toLowerCase()
    return data.filter((d) => {
      return (
        String(d.value).toLowerCase().includes(q) ||
        (d.category ?? '').toLowerCase().includes(q) ||
        new Date(d.timestamp).toLocaleString().toLowerCase().includes(q)
      )
    })
  }, [data, search])

  const sorted = useMemo(() => {
    const copy = filtered.slice()
    copy.sort((a, b) => {
      let v = 0
      if (sortBy === 'timestamp') v = (a.timestamp ?? 0) - (b.timestamp ?? 0)
      if (sortBy === 'value') v = a.value - b.value
      if (sortBy === 'category') v = String(a.category ?? '').localeCompare(String(b.category ?? ''))
      return sortDir === 'asc' ? v : -v
    })
    return copy
  }, [filtered, sortBy, sortDir])

  const flattened = useMemo(() => {
    if (!groupBy) return sorted.map((s) => ({ type: 'row', item: s } as FlatItem))
    const groups = new Map<string, DataPoint[]>()
    for (const d of sorted) {
      const key = d.category ?? 'uncategorized'
      const arr = groups.get(key) ?? []
      arr.push(d)
      groups.set(key, arr)
    }
    const out: FlatItem[] = []
    for (const [key, arr] of groups) {
      out.push({ type: 'group', key })
      for (const it of arr) out.push({ type: 'row', item: it })
    }
    return out
  }, [sorted, groupBy])

  const total = flattened.length

  // virtualization with buffer
  const buffer = 8
  const { start: windowStart, end: windowEnd } = computeWindow(total, height, rowHeight, scrollTop)
  const start = Math.max(0, windowStart - buffer)
  const end = Math.min(total, windowEnd + buffer)
  const slice = flattened.slice(start, end)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => setScrollTop(el.scrollTop)
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortBy(col)
      setSortDir('desc')
    }
  }

  return (
    <div style={{ 
      background: colors.bgSecondary, 
      borderRadius: '12px', 
      padding: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '16px',
        marginBottom: '16px'
      }}>
        <h4 style={{ 
          margin: 0,
          color: colors.textAccent,
          fontSize: '1.1rem',
          fontWeight: 500
        }}>
          Data Table ({filtered.length} rows)
        </h4>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          alignItems: 'center' 
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input 
              placeholder="Search data..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              style={{ 
                padding: '8px 12px',
                paddingLeft: '32px',
                background: colors.bgPrimary,
                border: `1px solid ${colors.borderPrimary}`,
                borderRadius: '6px',
                color: colors.textPrimary,
                width: '200px'
              }} 
            />
            <span style={{
              position: 'absolute',
              left: '10px',
              color: colors.textSecondary
            }}>
              🔍
            </span>
          </div>
          <label style={{ 
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}>
            <input 
              type="checkbox" 
              checked={groupBy} 
              onChange={(e) => setGroupBy(e.target.checked)}
              style={{
                accentColor: colors.bgAccent
              }}
            />
            Group by category
          </label>
        </div>
      </div>

      <div
        ref={containerRef}
        style={{ 
          height, 
          overflow: 'auto', 
          border: `1px solid ${colors.borderPrimary}`,
          borderRadius: '8px',
          position: 'relative',
          background: colors.bgPrimary
        }}>
        <div style={{ height: total * rowHeight, position: 'relative' }}>
          <div style={{ 
            position: 'sticky', 
            top: 0, 
            left: 0, 
            right: 0,
            background: colors.bgSecondary,
            borderBottom: `2px solid ${colors.borderPrimary}`,
            zIndex: 10
          }}>
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              alignItems: 'center', 
              padding: '12px 16px',
              fontWeight: 500,
              color: colors.textSecondary
            }}>
              <div 
                style={{ 
                  width: '160px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }} 
                onClick={() => toggleSort('timestamp')}
              >
                Time 
                {sortBy === 'timestamp' && (
                  <span style={{ color: colors.textAccent }}>
                    {sortDir === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
              <div 
                style={{ 
                  width: '100px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }} 
                onClick={() => toggleSort('value')}
              >
                Value
                {sortBy === 'value' && (
                  <span style={{ color: colors.textAccent }}>
                    {sortDir === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
              <div 
                style={{ 
                  flex: 1, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }} 
                onClick={() => toggleSort('category')}
              >
                Category
                {sortBy === 'category' && (
                  <span style={{ color: colors.textAccent }}>
                    {sortDir === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div style={{ position: 'absolute', top: start * rowHeight, left: 0, right: 0 }}>
            {slice.map((d, i) => {
              if (d.type === 'group') {
                return (
                  <div 
                    key={`group-${d.key}-${start + i}`} 
                    style={{ 
                      height: rowHeight, 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '0 16px',
                      background: colors.bgSecondary,
                      borderBottom: `1px solid ${colors.borderPrimary}`,
                      color: colors.textAccent,
                      fontWeight: 500
                    }}
                  >
                    {d.key}
                  </div>
                )
              }
              const item = d.item
              return (
                <div 
                  key={item.timestamp + '-' + start + '-' + i} 
                  className="data-row"
                  style={{ 
                    height: rowHeight, 
                    display: 'flex', 
                    gap: '16px', 
                    alignItems: 'center', 
                    padding: '0 16px',
                    borderBottom: `1px solid ${colors.borderPrimary}`,
                    transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{ 
                    width: '160px', 
                    color: colors.textSecondary,
                    fontFamily: 'monospace'
                  }}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                  <div style={{ 
                    width: '100px',
                    color: colors.textPrimary,
                    fontFamily: 'monospace'
                  }}>
                    {item.value.toFixed(2)}
                  </div>
                  <div style={{ 
                    flex: 1,
                    color: colors.textPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: `hsl(${(item.category || 'unknown').split('.')[0].length * 30}, 70%, 50%)`
                    }} />
                    {item.category}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
