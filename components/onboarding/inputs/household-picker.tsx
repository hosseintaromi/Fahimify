"use client"

interface HouseholdPickerProps {
  value: number
  onChange: (value: number) => void
}

export default function HouseholdPicker({ value, onChange }: HouseholdPickerProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-foreground">Number of People in Household</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-colors ${
              value === num ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  )
}
