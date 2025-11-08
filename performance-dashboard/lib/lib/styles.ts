export const colors = {
  // Background colors
  bgPrimary: '#0f172a',    // Dark blue
  bgSecondary: '#1e293b',  // Slightly lighter blue
  bgTertiary: '#334155',   // Even lighter blue
  bgAccent: '#0d4b9e',     // Accent blue
  bgHover: '#1e40af',      // Hover state blue
  bgActive: '#2563eb',     // Active state blue
  
  // Text colors
  textPrimary: '#f8fafc',  // Almost white
  textSecondary: '#94a3b8', // Muted gray
  textAccent: '#60a5fa',    // Bright blue
  textHover: '#e2e8f0',     // Light gray hover
  
  // Border colors
  borderPrimary: '#334155',
  borderSecondary: '#475569',
  borderAccent: '#3b82f6',
  
  // Chart colors
  chartLine: '#60a5fa',
  chartGrid: '#1e293b',
  chartLabels: '#94a3b8',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
}

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px'
}

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
}

export const buttonStyles = {
  base: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid transparent',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  primary: {
    backgroundColor: colors.bgAccent,
    color: colors.textPrimary,
    '&:hover': {
      backgroundColor: colors.bgHover
    },
    '&:active': {
      backgroundColor: colors.bgActive
    }
  },
  secondary: {
    backgroundColor: colors.bgSecondary,
    color: colors.textPrimary,
    '&:hover': {
      backgroundColor: colors.bgHover
    }
  },
  small: {
    padding: '4px 8px',
    fontSize: '0.875rem'
  },
  icon: {
    padding: '6px',
    borderRadius: '4px'
  }
}

export const panelStyles = {
  background: colors.bgPrimary,
  borderRadius: '12px',
  border: `1px solid ${colors.borderPrimary}`,
  padding: spacing.md,
  boxShadow: shadows.md
}

export const gridStyles = {
  gap: spacing.md,
  padding: spacing.md
}

export const chartStyles = {
  container: {
    ...panelStyles,
    height: '360px',
    position: 'relative' as const
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block'
  },
  tooltip: {
    position: 'absolute' as const,
    backgroundColor: colors.bgSecondary,
    border: `1px solid ${colors.borderPrimary}`,
    borderRadius: '4px',
    padding: `${spacing.xs} ${spacing.sm}`,
    pointerEvents: 'none' as const,
    fontSize: '0.875rem',
    color: colors.textPrimary,
    zIndex: 1000
  }
}