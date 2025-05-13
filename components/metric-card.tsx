"use client"

import { Card } from "@/components/ui/card"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

interface MetricCardProps {
  title: string
  value: string | number
}

export function MetricCard({ title, value }: MetricCardProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    const numericValue = typeof value === "string" ? Number.parseFloat(value.replace(/[^0-9.-]+/g, "")) : value
    const animation = animate(count, numericValue, { duration: 1 })
    return animation.stop
  }, [value, count])

  return (
    <Card className="bg-[#0a0a1f]/50 border-[#00ffff]/30 p-4">
      <h3 className="text-xs font-medium text-[#00ffff]/70">{title}</h3>
      <motion.div className="font-mono text-4xl font-bold mt-1 mb-1 tracking-tighter bg-gradient-to-r from-[#00ffff] to-[#ff00ff] bg-clip-text text-transparent [text-shadow:_0_0_10px_rgba(0,255,255,0.5)]">
        {title === "Total Revenue" ? "$" : ""}
        {typeof value === "number"
          ? value.toLocaleString()
          : typeof value === "string"
            ? value
            : rounded.get().toLocaleString()}
      </motion.div>
    </Card>
  )
}
