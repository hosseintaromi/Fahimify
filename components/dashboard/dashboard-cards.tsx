"use client"

import { TrendingDown, Zap } from "lucide-react"
import TriRingChart from "./tri-ring-chart"

const weeklySpend = [
  { day: "Mon", percent: 60 },
  { day: "Tue", percent: 70 },
  { day: "Wed", percent: 65 },
  { day: "Thu", percent: 80 },
  { day: "Fri", percent: 75 },
  { day: "Sat", percent: 82 },
  { day: "Sun", percent: 58 },
]

export default function DashboardCards() {
  const hasNutrientBoost = true
  const nutrientStats = hasNutrientBoost
    ? [
        { label: "Magnesium", percent: 80, detail: "220 / 275 mg" },
        { label: "Calories", percent: 75, detail: "1800 / 2400 kcal" },
        { label: "Protein", percent: 85, detail: "68 / 80 g" },
      ]
    : [
        { label: "Fat", percent: 70, detail: "56 / 80 g" },
        { label: "Calories", percent: 75, detail: "1800 / 2400 kcal" },
        { label: "Protein", percent: 85, detail: "68 / 80 g" },
      ]

  const nutrientLayers = hasNutrientBoost
    ? [
        { label: "Magnesium", current: 220, target: 275, color: "#14b8a6" },
        { label: "Calories", current: 1800, target: 2400, color: "#38bdf8" },
        { label: "Protein", current: 68, target: 80, color: "#6366f1" },
      ]
    : [
        { label: "Fat", current: 56, target: 80, color: "#f97316" },
        { label: "Calories", current: 1800, target: 2400, color: "#38bdf8" },
        { label: "Protein", current: 68, target: 80, color: "#6366f1" },
      ]

  return (
    <div className="space-y-4">
      <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_25px_80px_rgba(15,118,110,0.12)] backdrop-blur">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Budget remaining</p>
            <p className="mt-2 text-4xl font-semibold text-teal-600">€112.50</p>
            <p className="text-sm text-slate-500">of €150.00</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Spent this week</p>
            <p className="text-lg font-semibold text-slate-900">€37.50</p>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              <TrendingDown size={14} />
              12% under plan
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-7 gap-2">
          {weeklySpend.map((entry) => (
            <div key={entry.day} className="flex flex-col items-center gap-2 text-xs font-medium text-slate-500">
              <div className="flex h-20 w-full items-end justify-center">
                <div
                  className={`w-full rounded-2xl ${
                    entry.percent >= 80 ? "bg-gradient-to-b from-sky-400 to-teal-500" : "bg-gradient-to-b from-slate-200 to-slate-100"
                  }`}
                  style={{ height: `${(entry.percent / 100) * 80}px` }}
                />
              </div>
              <span>{entry.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-100 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-lg shadow-sky-100/80 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Priority nutrient</p>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-teal-600 shadow-sm">
                <Zap size={14} />
                On track
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900">{hasNutrientBoost ? "Magnesium focus" : "Macro balance"}</h3>
            <p className="text-sm text-slate-500">
              {hasNutrientBoost ? "Boost enabled this week" : "No boost selected — monitoring key macros"}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {nutrientStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/80 bg-white/80 p-4 text-center shadow-sm">
                  <p className="text-2xl font-semibold text-slate-900">{stat.percent}%</p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center lg:pr-6">
            <TriRingChart layers={nutrientLayers} />
          </div>
        </div>
        <p className="text-xs text-slate-500">Goal adjusts automatically if you change your nutrient boost preference.</p>
      </div>
    </div>
  )
}
