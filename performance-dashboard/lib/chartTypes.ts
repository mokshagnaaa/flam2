export type DataPoint = {
  timestamp: number
  value: number
  category?: string
  color?: string
}

export type Point = {
  x: number
  y: number
  value: number
  color?: string
}

export type ChartType = 'line' | 'bar' | 'scatter' | 'heatmap'

export interface ChartTypeOptions {
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

export type ChartOptions = {
  type: ChartType
  options?: ChartTypeOptions
}