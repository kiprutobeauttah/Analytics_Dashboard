"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

type Dot = {
  intensity: number
  hue: number
  colorPhase: number
}

export function ContributionGraph() {
  const columns = 25
  const rows = 5
  const [dots, setDots] = useState<Dot[][]>([])
  // const controls = useAnimation()

  useEffect(() => {
    const newDots = Array.from({ length: columns }, () =>
      Array.from({ length: rows }, () => ({
        intensity: Math.random(),
        hue: Math.random() > 0.5 ? 180 : 300,
        colorPhase: Math.random() * Math.PI * 2, // Random starting phase
      })),
    )
    setDots(newDots)

    const interval = setInterval(() => {
      setDots((prevDots) =>
        prevDots.map((column) =>
          column.map((dot) => {
            const phase = (dot.colorPhase + 0.1) % (Math.PI * 2)
            const sinValue = Math.sin(phase)

            // Transition between colors based on phase
            let newHue
            if (sinValue < -0.33) {
              newHue = 0 // Black phase
            } else if (sinValue < 0.33) {
              newHue = 180 // Cyan phase
            } else {
              newHue = 300 // Magenta phase
            }

            return {
              ...dot,
              colorPhase: phase,
              hue: newHue,
              intensity: 0.3 + Math.abs(sinValue) * 0.5,
            }
          }),
        ),
      )
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full overflow-hidden p-2">
      <div className="grid grid-flow-col auto-cols-fr gap-2">
        {dots.map((column, columnIndex) => (
          <div key={columnIndex} className="grid grid-rows-5 gap-2">
            {column.map((dot, rowIndex) => (
              <motion.div
                key={rowIndex}
                // custom={(columnIndex * rows + rowIndex) * 0.02}
                // animate={controls}
                className="relative w-2 h-2"
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor:
                      dot.hue === 0
                        ? `rgba(0, 0, 0, ${dot.intensity})`
                        : `hsla(${dot.hue}, 100%, 50%, ${dot.intensity})`,
                    boxShadow:
                      dot.hue === 0 ? "none" : `0 0 5px 1px hsla(${dot.hue}, 100%, 50%, ${dot.intensity * 0.5})`,
                    transition: "background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  }}
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
