"use client"

import { useState } from "react"

interface BudgetSliderProps {
  value: number
  onChange: (value: number) => void
}

export default function BudgetSlider({ value, onChange }: BudgetSliderProps) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-card-foreground">Monthly Food Budget</label>
        <span className="text-lg font-bold text-primary">€{value}</span>
      </div>

      <input
        type="range"
        min="50"
        max="1000"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
        style={{
          background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${
            ((value - 50) / 950) * 100
          }%, var(--color-border) ${((value - 50) / 950) * 100}%, var(--color-border) 100%)`,
        }}
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>€50</span>
        <span>€1000</span>
      </div>
    </div>
  )
}
