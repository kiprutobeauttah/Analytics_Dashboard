"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type OrderEntry = {
  id: number
  product: string
  quantity: number
  price: number
  timestamp: string
}

const products = [
  "Cybernetic Implant",
  "Holo-Display",
  "Quantum Processor",
  "Neural Interface",
  "Plasma Rifle",
  "Stealth Suit",
  "Nano-Med Kit",
  "Gravity Boots",
  "AI Companion",
  "Time Dilation Device",
]

interface DataStreamProps {
  setTotalRevenue: React.Dispatch<React.SetStateAction<number>>
  setTotalOrders: React.Dispatch<React.SetStateAction<number>>
}

export function DataStream({ setTotalRevenue, setTotalOrders }: DataStreamProps) {
  const [orders, setOrders] = useState<OrderEntry[]>([])

  useEffect(() => {
    // Set initial total revenue
    setTotalRevenue(1540394)
    setTotalOrders(0) // Initialize total orders

    const interval = setInterval(() => {
      const newOrder = {
        id: Date.now(),
        product: products[Math.floor(Math.random() * products.length)],
        quantity: Math.floor(Math.random() * 5) + 1,
        price: Math.floor(Math.random() * 1000) + 100,
        timestamp: new Date().toISOString(),
      }

      setOrders((prev) => [newOrder, ...prev].slice(0, 30))
      setTotalRevenue((prev) => prev + newOrder.price * newOrder.quantity)
      setTotalOrders((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [setTotalRevenue, setTotalOrders])

  return (
    <div className="h-[400px] overflow-hidden p-4">
      <h3 className="text-xs font-medium text-[#00ffff]/70 mb-4">Recent Orders</h3>
      <div className="space-y-1 font-mono text-xs">
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[#00ffff]"
            >
              <span className="text-[#ff00ff]">{order.product}</span>
              {" x"}
              {order.quantity}
              {" - $"}
              {(order.price * order.quantity).toLocaleString()}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
