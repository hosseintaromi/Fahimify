"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface AllergiesInputProps {
  value: string[]
  onChange: (value: string[]) => void
}

const COMMON_ALLERGIES = [
  "Peanuts",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Fish",
  "Shellfish",
  "Soy",
  "Wheat",
  "Sesame",
  "Cilantro",
  "Gluten",
  "Seafood",
]

export default function AllergiesInput({ value, onChange }: AllergiesInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleAdd = (allergy: string) => {
    if (!value.includes(allergy)) {
      onChange([...value, allergy])
      setInputValue("")
      setSuggestions([])
    }
  }

  const handleRemove = (allergy: string) => {
    onChange(value.filter((a) => a !== allergy))
  }

  const handleInputChange = (e: string) => {
    setInputValue(e)
    if (e.length > 0) {
      const filtered = COMMON_ALLERGIES.filter(
        (allergy) => allergy.toLowerCase().includes(e.toLowerCase()) && !value.includes(allergy),
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      handleAdd(inputValue.trim())
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-card-foreground block">Allergies & Dislikes</label>

      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add allergies or dislikes..."
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10">
            {suggestions.slice(0, 4).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleAdd(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-muted text-card-foreground text-sm transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((allergy) => (
            <div
              key={allergy}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-3 py-1 rounded-full text-sm font-medium"
            >
              {allergy}
              <button
                onClick={() => handleRemove(allergy)}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quick Select Buttons */}
      <div className="pt-2">
        <p className="text-xs text-muted-foreground mb-2">Common allergies:</p>
        <div className="flex flex-wrap gap-2">
          {COMMON_ALLERGIES.slice(0, 6).map((allergy) => (
            <button
              key={allergy}
              onClick={() => handleAdd(allergy)}
              disabled={value.includes(allergy)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                value.includes(allergy)
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
