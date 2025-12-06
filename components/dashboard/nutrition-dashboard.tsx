"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import NutritionCircle from "./nutrition-circle"

type TabType = "daily" | "overtime"

interface DateRange {
  from: string
  to: string
}

export default function NutritionDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("daily")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  })

  // Sample nutrition data
  const nutritionData = {
    daily: {
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
    overtime: {
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
  }

  const data = activeTab === "daily" ? nutritionData.daily : nutritionData.overtime

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Nutrition Tracking</h2>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab("daily")}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === "daily"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setActiveTab("overtime")}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === "overtime"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Overtime
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Date Range Picker for Overtime */}
        {activeTab === "overtime" && (
          <div className="mb-6 bg-card rounded-lg border border-border p-4 space-y-3">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar size={16} />
              Select Date Range
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">From</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">To</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* Priority Nutrient - Large Circle */}
        <div className="mb-8 flex justify-center">
          <NutritionCircle
            label={data.priority.label}
            percentage={data.priority.percentage}
            current={data.priority.current}
            target={data.priority.target}
            unit={data.priority.unit}
            size="large"
          />
        </div>

        {/* Other Nutrients - Grid of Small Circles */}
        <div className="grid grid-cols-2 gap-6">
          {data.nutrients.map((nutrient, index) => (
            <NutritionCircle
              key={index}
              label={nutrient.label}
              percentage={nutrient.percentage}
              current={nutrient.current}
              target={nutrient.target}
              unit={nutrient.unit}
              size="small"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
