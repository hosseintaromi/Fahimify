"use client"

import { TrendingDown, Zap } from "lucide-react"
import TriRingChart from "./tri-ring-chart"
import { useEffect, useState } from "react"

type DashboardCardsProps = {
  budget?: number
  spent?: number
  priority?: string
  estimatedWeeklyCost?: number
  dailySpending?: Record<string, number>
}

interface MacroData {
  current: number
  target: number
  percentage: number
  unit: string
}

interface NutritionData {
  macros: {
    protein: MacroData
    carbs: MacroData
    fat: MacroData
    calories: MacroData
  }
}

export default function DashboardCards({ budget = 150, spent = 0, priority, estimatedWeeklyCost = 0, dailySpending = {} }: DashboardCardsProps) {
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)

  const remaining = budget - spent
  const hasSpend = spent > 0

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const res = await fetch("/api/nutrition", {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        if (res.ok) {
          const data = await res.json()
          setNutritionData(data)
        }
      } catch (err) {
        console.error("Failed to fetch nutrition:", err)
      }
    }
    if (hasSpend) {
      fetchNutrition()
    }
  }, [spent, hasSpend])
  const underPlanPercent = hasSpend && budget ? Math.max(0, Math.round(((budget - spent) / budget) * 100)) : 0
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const weeklySpend = daysOfWeek.map((day) => {
    const daySpent = dailySpending[day] || 0
    return {
      day: day.slice(0, 3),
      percent: budget ? Math.min(100, Math.max(5, (daySpent / budget) * 100 * 7)) : 5,
      amount: daySpent,
    }
  })
  const hasNutrientData = nutritionData && nutritionData.macros && hasSpend
  const hasNutrientBoost = Boolean(priority) && hasNutrientData

  const fatPercent = nutritionData?.macros.fat.percentage || 0
  const caloriesPercent = nutritionData?.macros.calories.percentage || 0
  const proteinPercent = nutritionData?.macros.protein.percentage || 0
  const carbsPercent = nutritionData?.macros.carbs.percentage || 0

  const nutrientStats = hasNutrientData
    ? hasNutrientBoost
      ? [
        { label: priority ?? "Priority", percent: carbsPercent, detail: "Goal in progress" },
        { label: "Calories", percent: caloriesPercent, detail: "Tracking" },
        { label: "Protein", percent: proteinPercent, detail: "Tracking" },
      ]
      : [
        { label: "Fat", percent: fatPercent, detail: "Tracking" },
        { label: "Calories", percent: caloriesPercent, detail: "Tracking" },
        { label: "Protein", percent: proteinPercent, detail: "Tracking" },
      ]
    : []

  const nutrientLayers = hasNutrientData
    ? hasNutrientBoost
      ? [
        { label: priority ?? "Priority", current: carbsPercent, target: 100, color: "#14b8a6" },
        { label: "Calories", current: caloriesPercent, target: 100, color: "#38bdf8" },
        { label: "Protein", current: proteinPercent, target: 100, color: "#6366f1" },
      ]
      : [
        { label: "Fat", current: fatPercent, target: 100, color: "#f97316" },
        { label: "Calories", current: caloriesPercent, target: 100, color: "#38bdf8" },
        { label: "Protein", current: proteinPercent, target: 100, color: "#6366f1" },
      ]
    : []

  return (
    <div className="space-y-4">
      <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_25px_80px_rgba(15,118,110,0.12)] backdrop-blur">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Budget remaining</p>
            <p className="mt-2 text-4xl font-semibold text-teal-600">€{remaining.toFixed(2)}</p>
            <p className="text-sm text-slate-500">of €{budget.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Spent this week</p>
            <p className="text-lg font-semibold text-slate-900">€{spent.toFixed(2)}</p>
            {hasSpend ? (
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                <TrendingDown size={14} />
                {underPlanPercent}% under plan
              </div>
            ) : (
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                No spend yet
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 grid grid-cols-7 gap-2">
          {weeklySpend.map((entry) => (
            <div key={entry.day} className="flex flex-col items-center gap-2 text-xs font-medium text-slate-500">
              <div className="flex h-20 w-full items-end justify-center">
                <div
                  className={`w-full rounded-2xl ${entry.amount > 0 ? "bg-gradient-to-b from-sky-400 to-teal-500" : "bg-gradient-to-b from-slate-200 to-slate-100"}`}
                  style={{ height: `${Math.max(5, (entry.percent / 100) * 80)}px` }}
                />
              </div>
              <span>{entry.day}</span>
              {entry.amount > 0 && <span className="text-[10px] font-semibold text-teal-600">€{entry.amount.toFixed(1)}</span>}
            </div>
          ))}
        </div>
        {estimatedWeeklyCost > 0 && (
          <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Estimated weekly cost</span>
              <span className="font-semibold text-blue-600">€{estimatedWeeklyCost.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[32px] border border-slate-100 bg-linear-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-lg shadow-sky-100/80 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Priority nutrient</p>
              {hasNutrientData ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-teal-600 shadow-sm">
                  <Zap size={14} />
                  On track
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                  No data yet
                </div>
              )}
            </div>
            <h3 className="text-2xl font-semibold text-slate-900">{hasNutrientBoost ? "Magnesium focus" : "Macro balance"}</h3>
            <p className="text-sm text-slate-500">{hasNutrientData ? "Tracking" : "No nutrient data yet"}</p>
            {hasNutrientData ? (
              <div className="grid grid-cols-3 gap-3">
                {nutrientStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/80 bg-white/80 p-4 text-center shadow-sm">
                    <p className="text-2xl font-semibold text-slate-900">{stat.percent}%</p>
                    <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{stat.detail}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-white/60 p-4 text-sm text-slate-500">
                Add meals with nutrient info to see tracking here
              </div>
            )}
          </div>
          {hasNutrientData ? (
            <div className="flex items-center justify-center lg:pr-6">
              <TriRingChart layers={nutrientLayers} />
            </div>
          ) : (
            <div className="flex items-center justify-center lg:pr-6 text-sm text-slate-400">No chart data</div>
          )}
        </div>
        <p className="text-xs text-slate-500">
          {hasNutrientData ? "Goal adjusts automatically if you change your nutrient boost preference." : "Waiting for nutrient data to personalize goals."}
        </p>
      </div>
    </div>
  )
}
