"use client"
import { X } from "lucide-react"

const CUISINES = ["Italian", "Asian", "Mexican", "Indian", "Mediterranean", "Thai", "French", "American"]

interface CuisineItem {
  style: string
  priority: number
}

interface CuisinePrioritySelectProps {
  value: CuisineItem[]
  onChange: (value: CuisineItem[]) => void
}

export default function CuisinePrioritySelect({ value, onChange }: CuisinePrioritySelectProps) {
  const handleToggleCuisine = (style: string) => {
    if (value.some((c) => c.style === style)) {
      onChange(value.filter((c) => c.style !== style))
    } else {
      onChange([...value, { style, priority: 3 }])
    }
  }

  const handlePriorityChange = (style: string, priority: number) => {
    onChange(value.map((c) => (c.style === style ? { ...c, priority } : c)))
  }

  return (
    <div className="space-y-6">
      {/* Cuisine buttons */}
      <div className="grid grid-cols-2 gap-3">
        {CUISINES.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => handleToggleCuisine(cuisine)}
            className={`px-4 py-3 rounded-2xl border font-semibold transition ${
              value.some((c) => c.style === cuisine)
                ? "border-transparent bg-gradient-to-r from-teal-500 to-sky-500 text-white shadow-lg shadow-teal-500/30"
                : "bg-white border-slate-200 text-slate-700 hover:border-teal-200 hover:text-teal-600"
            }`}
          >
            {cuisine}
          </button>
        ))}
      </div>

      {/* Selected cuisines with priority scale */}
      {value.length > 0 && (
        <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <p className="text-sm font-medium text-slate-600">Your cuisines (1 = least, 5 = most preferred):</p>
          {value.map((cuisine) => (
            <div key={cuisine.style} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800">{cuisine.style}</span>
                <button
                  onClick={() => onChange(value.filter((c) => c.style !== cuisine.style))}
                  className="text-slate-300 hover:text-rose-500 transition"
                >
                  <X size={18} />
                </button>
              </div>
              {/* Priority scale bar */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handlePriorityChange(cuisine.style, level)}
                    className={`flex-1 h-2 rounded-full transition ${
                      level <= cuisine.priority
                        ? "bg-gradient-to-r from-teal-500 to-sky-500"
                        : "bg-slate-200 hover:bg-slate-300"
                    }`}
                    title={`Priority ${level}`}
                  />
                ))}
              </div>
              <div className="text-right text-xs text-slate-500">Priority: {cuisine.priority}/5</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
