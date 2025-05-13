"use client"

import { useEffect, useRef } from "react"

interface Bar {
  x: number
  y: number
  width: number
  height: number
  speed: number
  intensity: number
  hue: number
  targetIntensity: number
  thickness: number
}

export function ActivityGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    const columns = 12
    const barsPerColumn = 40
    const columnWidth = canvas.width / columns
    const baseBarWidth = columnWidth * 0.4

    let bars: Bar[][] = Array(columns)
      .fill(null)
      .map((_, colIndex) => {
        return Array(barsPerColumn)
          .fill(null)
          .map(() => {
            const isThick = Math.random() > 0.7
            const thickness = isThick ? 4 + Math.random() * 4 : 1 + Math.random() * 2

            return {
              x: colIndex * columnWidth + (columnWidth - baseBarWidth) / 2,
              y: canvas.height * Math.random(),
              width: baseBarWidth,
              height: thickness,
              speed: 0.5 + Math.random() * 1.5,
              intensity: Math.random() > 0.7 ? 0.8 : 0.3,
              targetIntensity: Math.random() > 0.7 ? 0.8 : 0.3,
              thickness,
              hue: Math.random() > 0.5 ? 180 : 300, // Cyan or Magenta
            }
          })
      })

    const drawBar = (bar: Bar, alpha: number, blurSize: number, scale = 1) => {
      ctx.save()
      ctx.shadowBlur = blurSize
      ctx.shadowColor = `hsla(${bar.hue}, 100%, 50%, ${alpha})`

      const gradient = ctx.createLinearGradient(bar.x - blurSize, bar.y, bar.x + bar.width + blurSize, bar.y)

      gradient.addColorStop(0, `hsla(${bar.hue}, 100%, 50%, 0)`)
      gradient.addColorStop(0.4, `hsla(${bar.hue}, 100%, 50%, ${alpha})`)
      gradient.addColorStop(0.5, `hsla(${bar.hue}, 100%, 80%, ${alpha})`)
      gradient.addColorStop(0.6, `hsla(${bar.hue}, 100%, 50%, ${alpha})`)
      gradient.addColorStop(1, `hsla(${bar.hue}, 100%, 50%, 0)`)

      ctx.fillStyle = gradient

      const scaledWidth = bar.width * scale
      const scaledX = bar.x + (bar.width - scaledWidth) / 2

      ctx.fillRect(scaledX - blurSize, bar.y, scaledWidth + blurSize * 2, bar.thickness)
      ctx.restore()
    }

    const animate = () => {
      ctx.fillStyle = "#0a0a1f"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      bars = bars.map((column) => {
        return column.map((bar) => {
          bar.y -= bar.speed

          if (bar.y < -bar.height) {
            bar.y = canvas.height + Math.random() * 20
            bar.thickness = Math.random() > 0.7 ? 4 + Math.random() * 4 : 1 + Math.random() * 2
            bar.targetIntensity = Math.random() > 0.7 ? 0.8 + Math.random() * 0.2 : 0.1 + Math.random() * 0.3
            bar.hue = Math.random() > 0.5 ? 180 : 300 // Cyan or Magenta
          }

          bar.intensity += (bar.targetIntensity - bar.intensity) * 0.2

          // Outermost soft glow
          if (bar.intensity > 0.5) {
            drawBar(bar, 0.05, 40, 2.5)
          }

          // Outer glow
          if (bar.intensity > 0.4) {
            drawBar(bar, 0.1, 30, 2)
          }

          // Middle glow
          if (bar.intensity > 0.3) {
            drawBar(bar, 0.2, 20, 1.5)
          }

          // Inner glow
          drawBar(bar, 0.4, 15, 1.2)

          // Core
          drawBar(bar, bar.intensity, 10)

          return bar
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      // Cleanup if needed
    }
  }, [])

  return (
    <div className="w-full h-[400px] relative overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
