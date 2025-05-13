"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ActivityGraph } from "./components/activity-graph"
import { ContributionGraph } from "./components/contribution-graph"
import { DataStream } from "./components/data-stream"
import { MetricCard } from "./components/metric-card"
import Image from "next/image"

const headshots = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=70",
  ...Array.from({ length: 28 }, (_, i) => `https://i.pravatar.cc/100?img=${i + 3}`),
]

export default function Dashboard() {
  const controls = Array.from({ length: headshots.length }, () => useAnimation())
  const [users, setUsers] = useState(
    headshots.map((image, i) => ({
      id: i,
      image,
      control: controls[i],
    })),
  )

  const [totalRevenue, setTotalRevenue] = useState(1540394)
  const [totalOrders, setTotalOrders] = useState(19543)
  const [activeSessions, setActiveSessions] = useState(533938)

  useEffect(() => {
    // Initial appearance animation for avatars
    users.forEach((user) => {
      user.control.start({
        scale: [0, 1],
        opacity: [0, 1],
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: users.indexOf(user) * 0.05,
        },
      })
    })

    // Random pulsing animation for avatars
    const avatarInterval = setInterval(() => {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      randomUser.control.start({
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1],
        transition: { duration: 0.5 },
      })
    }, 1000)

    // Dynamic counter updates - REMOVED counterInterval
    // const counterInterval = setInterval(() => {
    //   //setTotalRevenue((prev) => prev + Math.floor(Math.random() * 100))
    //   setTotalOrders((prev) => prev + Math.floor(Math.random() * 5))
    //   setActiveSessions((prev) => prev + Math.floor(Math.random() * 10))
    // }, 2000)

    return () => {
      clearInterval(avatarInterval)
      //clearInterval(counterInterval)
    }
  }, [users])

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-[#00ffff] p-4 font-['Orbitron',_sans-serif] relative overflow-hidden">
      {/* Retro grid background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgo8ZGVmcz4KICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgIDxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+Cjwvc3ZnPg==')] opacity-20" />

      <div className="max-w-[1800px] mx-auto space-y-4 relative z-10">
        {/* Top metrics */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-4">
          <MetricCard title="Total Revenue" value={totalRevenue} />
          <MetricCard title="Total Orders" value={totalOrders} />
        </div>

        {/* Main visualization area */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          <Card className="bg-[#0a0a1f]/50 border-[#00ffff]/30">
            <ActivityGraph />
          </Card>
          <Card className="bg-[#0a0a1f]/50 border-[#00ffff]/30">
            <DataStream setTotalRevenue={setTotalRevenue} setTotalOrders={setTotalOrders} />
          </Card>
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4">
          <Card className="bg-[#0a0a1f]/50 border-[#00ffff]/30 p-4">
            <h3 className="text-xs font-medium text-[#00ffff]/70 mb-2">Active Sessions</h3>
            <div className="font-mono text-4xl font-bold mb-2 tracking-tighter text-[#ff00ff]">
              {activeSessions.toLocaleString()}
            </div>
            <ContributionGraph />
          </Card>

          <Card className="bg-[#0a0a1f]/50 border-[#00ffff]/30 p-4">
            <h3 className="text-xs font-medium text-[#00ffff]/70 mb-2">Users with Items in Cart</h3>
            <div className="font-mono text-4xl font-bold mb-4 tracking-tighter text-[#ff00ff]">30</div>
            <div className="flex flex-wrap gap-1">
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  animate={user.control}
                  className="relative w-8 h-8 rounded-full overflow-hidden border border-[#00ffff]/50"
                >
                  <Image
                    src={user.image || "/placeholder.svg"}
                    alt={`User ${user.id + 1}`}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
