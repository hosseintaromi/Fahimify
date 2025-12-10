"use client"

import { useState, useEffect } from "react"
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
  totalNutrients: Record<string, number>
  logs: any[]
  date: string
}

export default function NutritionTracking() {
  const [mealType, setMealType] = useState<MealType>("overall")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  })
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const res = await fetch(`/api/nutrition?date=${dateRange.from}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        if (res.ok) {
          const data = await res.json()
          setNutritionData(data)
        }
      } catch (err) {
        console.error("Failed to fetch nutrition:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchNutrition()
  }, [dateRange.from])

  const hasData = nutritionData && nutritionData.logs.length > 0

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dff7ef] via-[#e7f5ff] to-white">
        Loading nutrition data...
      </div>
    )
  }

  const highlightNutrients: HighlightNutrient[] = nutritionData ? [
    {
      label: "Protein",
      badge: "PROTEIN",
      accent: "from-indigo-50 to-white",
      percentage: nutritionData.macros.protein.percentage,
      current: nutritionData.macros.protein.current,
      target: nutritionData.macros.protein.target,
      unit: nutritionData.macros.protein.unit,
    },
    {
      label: "Carbs",
      badge: "CALORIES",
      accent: "from-teal-50 to-white",
      percentage: nutritionData.macros.calories.percentage,
      current: nutritionData.macros.calories.current,
      target: nutritionData.macros.calories.target,
      unit: nutritionData.macros.calories.unit,
    },
    {
      label: "Fat",
      badge: "FAT",
      accent: "from-emerald-50 to-white",
      percentage: nutritionData.macros.fat.percentage,
      current: nutritionData.macros.fat.current,
      target: nutritionData.macros.fat.target,
      unit: nutritionData.macros.fat.unit,
    },
  ] : []

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
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${mealType === filter.value
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

        {nutritionData && (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(nutritionData.totalNutrients)
              .filter(([key]) => !["calories", "protein", "carbs", "fat"].includes(key))
              .map(([key, value]) => {
                const target = key === "iron" ? 18 : key === "magnesium" ? 400 : key === "potassium" ? 3500 : 100
                const percentage = Math.min(Math.round((value / target) * 100), 100)
                return (
                  <div key={key} className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-sm">
                    <NutritionCircle
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      percentage={percentage}
                      current={value}
                      target={target}
                      unit="mg"
                      size="small"
                    />
                    <p className="mt-2 text-xs text-slate-500 text-center">
                      {value.toFixed(1)}/{target} mg
                    </p>
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
