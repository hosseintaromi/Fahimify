"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import NutritionCircle from "./nutrition-circle"

type MealType = "overall" | "breakfast" | "lunch" | "dinner"

interface HighlightNutrient {
  label: string
  badge: string
  accent: string
  percentage: number
  current: number
  target: number
  unit: string
}

interface DateRange {
  from: string
  to: string
}

export default function NutritionTracking() {
  const [mealType, setMealType] = useState<MealType>("overall")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  })

  const hasData = false

  const mealFilters: { label: string; value: MealType }[] = [
    { label: "Overall", value: "overall" },
    { label: "Breakfast", value: "breakfast" },
    { label: "Lunch", value: "lunch" },
    { label: "Dinner", value: "dinner" },
  ]

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dff7ef] via-[#e7f5ff] to-white pb-16">
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Fahimify labs</p>
            <h2 className="text-3xl font-semibold text-slate-900">Nutrition Tracking</h2>
            <p className="text-sm text-slate-500">No nutrition data yet. Add meals and log intake to see charts here.</p>
          </div>
          <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/80 p-6 text-center text-slate-500">
            Waiting for meal data to calculate macros and micros.
          </div>
        </div>
      </div>
    )
  }

  const nutritionData = { daily: {}, overtime: {} } as any
  const dailyData = nutritionData.daily[mealType]
  const overtimeData = nutritionData.overtime[mealType]

  const highlightNutrients: HighlightNutrient[] = []

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dff7ef] via-[#e7f5ff] to-white pb-16">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Fahimify labs</p>
          <h2 className="text-3xl font-semibold text-slate-900">Nutrition Tracking</h2>
          <p className="text-sm text-slate-500">Dial into your nutrients with meal-level and overtime controls side by side.</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {mealFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setMealType(filter.value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  mealType === filter.value
                    ? "border-teal-200 bg-white text-teal-600 shadow-sm"
                    : "border-white/60 bg-white/50 text-slate-500 hover:border-teal-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-lg space-y-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Calendar size={16} />
              Select overtime range
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">From</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(event) => setDateRange({ ...dateRange, from: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">To</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(event) => setDateRange({ ...dateRange, to: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-lg space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Key metrics</p>
                <h3 className="text-3xl font-semibold text-slate-900">Daily rings</h3>
                <p className="text-sm text-slate-500">Each ring mirrors Apple’s activity view for fast scanning.</p>
              </div>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-600">
                Updated live
              </span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {highlightNutrients.map((nutrient) => (
              <div
                key={nutrient.label}
                className={`rounded-[28px] border border-white/70 bg-gradient-to-br ${nutrient.accent} p-4 text-center shadow-inner`}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">{nutrient.badge}</span>
                <div className="mt-3 flex justify-center">
                  <NutritionCircle
                    label={nutrient.label}
                    percentage={nutrient.percentage}
                    current={nutrient.current}
                    target={nutrient.target}
                    unit={nutrient.unit}
                    size="large"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Overtime view</p>
              <h3 className="text-2xl font-semibold text-slate-900">Weekly progression</h3>
              <p className="text-sm text-slate-500">
                {dateRange.from} – {dateRange.to}
              </p>
            </div>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">Synced</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {["Calories", "Protein", "Fat"].map((label) => {
              const nutrient = overtimeData.nutrients.find((item) => item.label === label)
              if (!nutrient) return null
              return (
                <div key={label} className="rounded-[24px] border border-white/70 bg-white/90 p-4 text-center shadow-sm">
                  <NutritionCircle
                    label={nutrient.label}
                    percentage={nutrient.percentage}
                    current={nutrient.current}
                    target={nutrient.target}
                    unit={nutrient.unit}
                    size="small"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    {nutrient.current}/{nutrient.target} {nutrient.unit}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {dailyData.nutrients.map((nutrient) => (
            <div key={nutrient.label} className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-sm">
              <NutritionCircle
                label={nutrient.label}
                percentage={nutrient.percentage}
                current={nutrient.current}
                target={nutrient.target}
                unit={nutrient.unit}
                size="small"
              />
              <p className="mt-2 text-xs text-slate-500 text-center">
                {nutrient.current}/{nutrient.target} {nutrient.unit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
