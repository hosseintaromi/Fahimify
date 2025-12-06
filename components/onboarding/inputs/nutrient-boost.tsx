"use client"

interface NutrientBoostProps {
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  nutrient: string
  onNutrientChange: (nutrient: string) => void
}

const NUTRIENTS = ["Iron", "Potassium", "Magnesium", "Vitamin D", "Calcium", "Zinc"]

export default function NutrientBoost({ enabled, onEnabledChange, nutrient, onNutrientChange }: NutrientBoostProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-foreground">Want to boost a specific nutrient?</label>
        <button
          onClick={() => {
            onEnabledChange(!enabled)
            if (!enabled) onNutrientChange("")
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Select Priority Nutrient</label>
          <select
            value={nutrient}
            onChange={(e) => onNutrientChange(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Choose a nutrient...</option>
            {NUTRIENTS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
