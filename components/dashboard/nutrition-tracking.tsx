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

  const nutritionData = {
    daily: {
      overall: {
        priority: { label: "Magnesium", percentage: 80, current: 220, target: 275, unit: "mg" },
        nutrients: [
          { label: "Calories", percentage: 75, current: 1800, target: 2400, unit: "kcal" },
          { label: "Protein", percentage: 85, current: 68, target: 80, unit: "g" },
          { label: "Fat", percentage: 70, current: 56, target: 80, unit: "g" },
          { label: "Saturated Fat", percentage: 60, current: 18, target: 30, unit: "g" },
          { label: "Carbs", percentage: 80, current: 200, target: 250, unit: "g" },
          { label: "Fibre", percentage: 65, current: 13, target: 20, unit: "g" },
          { label: "Sugar", percentage: 45, current: 27, target: 60, unit: "g" },
          { label: "Salt", percentage: 70, current: 3.5, target: 5, unit: "g" },
        ],
      },
      breakfast: {
        priority: { label: "Magnesium", percentage: 25, current: 55, target: 275, unit: "mg" },
        nutrients: [
          { label: "Calories", percentage: 20, current: 480, target: 2400, unit: "kcal" },
          { label: "Protein", percentage: 30, current: 24, target: 80, unit: "g" },
          { label: "Fat", percentage: 25, current: 20, target: 80, unit: "g" },
          { label: "Saturated Fat", percentage: 20, current: 6, target: 30, unit: "g" },
          { label: "Carbs", percentage: 28, current: 70, target: 250, unit: "g" },
          { label: "Fibre", percentage: 40, current: 8, target: 20, unit: "g" },
          { label: "Sugar", percentage: 35, current: 21, target: 60, unit: "g" },
          { label: "Salt", percentage: 20, current: 1, target: 5, unit: "g" },
        ],
      },
      lunch: {
        priority: { label: "Magnesium", percentage: 35, current: 96, target: 275, unit: "mg" },
        nutrients: [
          { label: "Calories", percentage: 35, current: 840, target: 2400, unit: "kcal" },
          { label: "Protein", percentage: 40, current: 32, target: 80, unit: "g" },
          { label: "Fat", percentage: 35, current: 28, target: 80, unit: "g" },
          { label: "Saturated Fat", percentage: 30, current: 9, target: 30, unit: "g" },
          { label: "Carbs", percentage: 35, current: 88, target: 250, unit: "g" },
          { label: "Fibre", percentage: 30, current: 6, target: 20, unit: "g" },
          { label: "Sugar", percentage: 25, current: 15, target: 60, unit: "g" },
          { label: "Salt", percentage: 30, current: 1.5, target: 5, unit: "g" },
        ],
      },
      dinner: {
        priority: { label: "Magnesium", percentage: 20, current: 69, target: 275, unit: "mg" },
        nutrients: [
          { label: "Calories", percentage: 20, current: 480, target: 2400, unit: "kcal" },
          { label: "Protein", percentage: 15, current: 12, target: 80, unit: "g" },
          { label: "Fat", percentage: 10, current: 8, target: 80, unit: "g" },
          { label: "Saturated Fat", percentage: 10, current: 3, target: 30, unit: "g" },
          { label: "Carbs", percentage: 17, current: 42, target: 250, unit: "g" },
          { label: "Fibre", percentage: 20, current: 4, target: 20, unit: "g" },
          { label: "Sugar", percentage: 15, current: 9, target: 60, unit: "g" },
          { label: "Salt", percentage: 20, current: 1, target: 5, unit: "g" },
        ],
      },
    },
    overtime: {
      overall: {
        priority: { label: "Magnesium", percentage: 82, current: 1540, target: 1925, unit: "mg" },
        nutrients: [
          { label: "Calories", percentage: 78, current: 12600, target: 16800, unit: "kcal" },
          { label: "Protein", percentage: 87, current: 476, target: 560, unit: "g" },
          { label: "Fat", percentage: 72, current: 392, target: 560, unit: "g" },
          { label: "Saturated Fat", percentage: 62, current: 126, target: 210, unit: "g" },
          { label: "Carbs", percentage: 82, current: 1400, target: 1750, unit: "g" },
          { label: "Fibre", percentage: 68, current: 91, target: 140, unit: "g" },
          { label: "Sugar", percentage: 48, current: 189, target: 420, unit: "g" },
          { label: "Salt", percentage: 72, current: 24.5, target: 35, unit: "g" },
        ],
      },
      breakfast: {
        priority: { label: "Magnesium", percentage: 25, current: 481, target: 1925, unit: "mg" },
        nutrients: [
          { label: "Calories", percentage: 22, current: 3360, target: 16800, unit: "kcal" },
          { label: "Protein", percentage: 32, current: 168, target: 560, unit: "g" },
          { label: "Fat", percentage: 28, current: 140, target: 560, unit: "g" },
          { label: "Saturated Fat", percentage: 22, current: 42, target: 210, unit: "g" },
          { label: "Carbs", percentage: 30, current: 490, target: 1750, unit: "g" },
          { label: "Fibre", percentage: 35, current: 56, target: 140, unit: "g" },
          { label: "Sugar", percentage: 40, current: 147, target: 420, unit: "g" },
          { label: "Salt", percentage: 22, current: 7, target: 35, unit: "g" },
        ],
      },
      lunch: {
        priority: { label: "Magnesium", percentage: 35, current: 672, target: 1925, unit: "mg" },
        nutrients: [
          { label: "Calories", percentage: 35, current: 5880, target: 16800, unit: "kcal" },
          { label: "Protein", percentage: 40, current: 224, target: 560, unit: "g" },
          { label: "Fat", percentage: 35, current: 196, target: 560, unit: "g" },
          { label: "Saturated Fat", percentage: 30, current: 63, target: 210, unit: "g" },
          { label: "Carbs", percentage: 38, current: 616, target: 1750, unit: "g" },
          { label: "Fibre", percentage: 30, current: 42, target: 140, unit: "g" },
          { label: "Sugar", percentage: 25, current: 105, target: 420, unit: "g" },
          { label: "Salt", percentage: 35, current: 10.5, target: 35, unit: "g" },
        ],
      },
      dinner: {
        priority: { label: "Magnesium", percentage: 22, current: 387, target: 1925, unit: "mg" },
        nutrients: [
          { label: "Calories", percentage: 21, current: 3360, target: 16800, unit: "kcal" },
          { label: "Protein", percentage: 15, current: 84, target: 560, unit: "g" },
          { label: "Fat", percentage: 12, current: 56, target: 560, unit: "g" },
          { label: "Saturated Fat", percentage: 10, current: 21, target: 210, unit: "g" },
          { label: "Carbs", percentage: 14, current: 294, target: 1750, unit: "g" },
          { label: "Fibre", percentage: 20, current: 28, target: 140, unit: "g" },
          { label: "Sugar", percentage: 12, current: 63, target: 420, unit: "g" },
          { label: "Salt", percentage: 15, current: 7, target: 35, unit: "g" },
        ],
      },
    },
  }

  const mealFilters: { label: string; value: MealType }[] = [
    { label: "Overall", value: "overall" },
    { label: "Breakfast", value: "breakfast" },
    { label: "Lunch", value: "lunch" },
    { label: "Dinner", value: "dinner" },
  ]

  const dailyData = nutritionData.daily[mealType]
  const overtimeData = nutritionData.overtime[mealType]

  const highlightNutrients: HighlightNutrient[] = [
    {
      label: dailyData.priority.label,
      badge: "Boost",
      accent: "from-teal-50 via-white to-emerald-50",
      percentage: dailyData.priority.percentage,
      current: dailyData.priority.current,
      target: dailyData.priority.target,
      unit: dailyData.priority.unit,
    },
  ]

  const calories = dailyData.nutrients.find((nutrient) => nutrient.label === "Calories")
  if (calories) {
    highlightNutrients.push({
      label: calories.label,
      badge: "Energy",
      accent: "from-sky-50 via-white to-cyan-50",
      percentage: calories.percentage,
      current: calories.current,
      target: calories.target,
      unit: calories.unit,
    })
  }

  const protein = dailyData.nutrients.find((nutrient) => nutrient.label === "Protein")
  if (protein) {
    highlightNutrients.push({
      label: protein.label,
      badge: "Protein",
      accent: "from-indigo-50 via-white to-violet-50",
      percentage: protein.percentage,
      current: protein.current,
      target: protein.target,
      unit: protein.unit,
    })
  }

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
