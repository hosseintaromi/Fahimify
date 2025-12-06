"use client"

const OPTIONS = [20, 40, 60, 80, 100, 120]

interface CookingTimeSliderProps {
  value: number
  onChange: (value: number) => void
}

export default function CookingTimeSlider({ value, onChange }: CookingTimeSliderProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Pick a time</p>
        <p className="text-sm text-slate-500">Tap a tile to set your maximum cook time.</p>
      </div>
      <span className="text-3xl font-semibold text-teal-600">{value}m</span>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`rounded-2xl border px-4 py-4 text-center text-sm font-semibold transition ${value === option
                ? "border-transparent bg-gradient-to-r from-teal-500 to-sky-500 text-white shadow-lg shadow-teal-500/30"
                : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:text-teal-600"
              }`}
          >
            {option}m
          </button>
        ))}
      </div>
    </div>
  )
}
