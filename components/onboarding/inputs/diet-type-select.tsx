"use client"

interface DietTypeSelectProps {
  value: string
  onChange: (value: string) => void
}

const DIET_TYPES = ["Omnivore", "Vegetarian", "Vegan", "Pescetarian"]

export default function DietTypeSelect({ value, onChange }: DietTypeSelectProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-foreground">Your Diet Type</label>
      <div className="grid grid-cols-2 gap-2">
        {DIET_TYPES.map((diet) => (
          <button
            key={diet}
            onClick={() => onChange(diet)}
            className={`py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
              value === diet ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {diet}
          </button>
        ))}
      </div>
    </div>
  )
}
