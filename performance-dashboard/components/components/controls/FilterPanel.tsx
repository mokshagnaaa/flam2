"use client"
import React from 'react'
import { colors, buttonStyles } from '../../lib/styles'
import { useDataContext } from '../providers/DataProvider'

export default function FilterPanel() {
  const { data, hidden, toggleCategory, showAllCategories, hideAllCategories } = useDataContext()
  
  const categories = React.useMemo(() => {
    const cats = new Set<string>()
    data.forEach(d => cats.add(d.category || 'unknown'))
    return Array.from(cats).sort()
  }, [data])

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
        <h4 style={{ margin: 0, color: colors.textAccent }}>Filters</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={showAllCategories} 
            style={{ 
              ...buttonStyles.base, 
              ...buttonStyles.small,
              backgroundColor: colors.bgSecondary
            }}
          >
            Show All
          </button>
          <button 
            onClick={hideAllCategories}
            style={{ 
              ...buttonStyles.base, 
              ...buttonStyles.small,
              backgroundColor: colors.bgSecondary
            }}
          >
            Hide All
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {categories.map(cat => (
          <label 
            key={cat} 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              background: hidden.has(cat) ? colors.bgPrimary : colors.bgTertiary,
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <input 
              type="checkbox" 
              checked={!hidden.has(cat)} 
              onChange={() => toggleCategory(cat)} 
              style={{ accentColor: colors.bgAccent }}
            />
            <span style={{ color: hidden.has(cat) ? colors.textSecondary : colors.textPrimary }}>
              {cat}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}