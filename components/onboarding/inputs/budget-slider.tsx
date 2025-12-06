"use client"

import type React from "react"

import { useState } from "react"

interface BudgetSliderProps {
  value: number
  onChange: (value: number) => void
}

export default function BudgetSlider({ value, onChange }: BudgetSliderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(String(value))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    const numValue = Number(inputValue)
    if (!isNaN(numValue) && numValue >= 40 && numValue <= 500) {
      onChange(numValue)
      setIsEditing(false)
    } else {
      setInputValue(String(value))
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur()
    } else if (e.key === "Escape") {
      setInputValue(String(value))
      setIsEditing(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-foreground">Weekly Food Budget</label>
      <div className="space-y-2">
        <input
          type="range"
          min="40"
          max="500"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: "var(--blue)" }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>€40</span>
          {isEditing ? (
            <input
              type="number"
              min="40"
              max="500"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-20 px-2 py-1 text-lg font-bold text-center rounded border border-blue text-foreground bg-background"
              style={{ borderColor: "var(--blue)" }}
            />
          ) : (
            <button
              onClick={() => {
                setIsEditing(true)
                setInputValue(String(value))
              }}
              className="text-lg font-bold cursor-pointer hover:opacity-80 transition-opacity"
              style={{ color: "var(--gold)" }}
            >
              €{value}
            </button>
          )}
          <span>€500</span>
        </div>
      </div>
    </div>
  )
}
