"use client"

interface CookingTimeSliderProps {
  value: number
  onChange: (value: number) => void
}

export default function CookingTimeSlider({ value, onChange }: CookingTimeSliderProps) {
  const presets = [15, 30, 60, 90, 120]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-card-foreground">Maximum Cooking Time per Meal</label>
        <span className="text-lg font-bold text-primary">{value} mins</span>
      </div>

      <input
        type="range"
        min="15"
        max="120"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
        style={{
          background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${
            ((value - 15) / 105) * 100
          }%, var(--color-border) ${((value - 15) / 105) * 100}%, var(--color-border) 100%)`,
        }}
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>15 mins</span>
        <span>120 mins</span>
      </div>

      {/* Quick Select Buttons */}
      <div className="grid grid-cols-5 gap-2 pt-2">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`py-2 rounded-lg text-xs font-medium transition-colors ${
              value === preset ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-border"
            }`}
          >
            {preset}m
          </button>
        ))}
      </div>
    </div>
  )
}
