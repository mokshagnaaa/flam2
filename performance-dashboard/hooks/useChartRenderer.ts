"use client"
import { useEffect, useRef } from 'react'

type DrawFn = (ctx: CanvasRenderingContext2D, width: number, height: number) => void

export function useChartRenderer(canvasRef: React.RefObject<HTMLCanvasElement | null>, draw: DrawFn, deps: any[] = []) {
  const drawRef = useRef<DrawFn>(draw)
  drawRef.current = draw

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0

    const render = () => {
      const ratio = devicePixelRatio || 1
      const w = Math.max(1, Math.floor(canvas.clientWidth * ratio))
      const h = Math.max(1, Math.floor(canvas.clientHeight * ratio))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      ctx.save()
      ctx.scale(ratio, ratio)
      drawRef.current(ctx, canvas.clientWidth, canvas.clientHeight)
      ctx.restore()
      raf = requestAnimationFrame(render)
    }

    raf = requestAnimationFrame(render)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
