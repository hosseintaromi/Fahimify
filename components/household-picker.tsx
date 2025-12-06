"use client"

interface HouseholdPickerProps {
  value: number
  onChange: (value: number) => void
}

export default function HouseholdPicker({ value, onChange }: HouseholdPickerProps) {
  const options = Array.from({ length: 10 }, (_, i) => i + 1)

  const handleDecrement = () => {
    if (value > 1) onChange(value - 1)
  }

  const handleIncrement = () => {
    if (value < 10) onChange(value + 1)
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-card-foreground block">Number of People in Household</label>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleDecrement}
          className="w-10 h-10 rounded-full border border-border bg-background hover:bg-muted text-card-foreground font-semibold transition-colors"
        >
          −
        </button>

        <div className="relative">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-primary">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{value === 1 ? "person" : "people"}</div>
          </div>
        </div>

        <button
          onClick={handleIncrement}
          className="w-10 h-10 rounded-full border border-border bg-background hover:bg-muted text-card-foreground font-semibold transition-colors"
        >
          +
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {options.map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors ${
              value === num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-border"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  )
}
