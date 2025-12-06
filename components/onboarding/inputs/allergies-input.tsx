"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface AllergiesInputProps {
  value: string[]
  onChange: (value: string[]) => void
}

const COMMON_ALLERGIES = ["Peanuts", "Tree Nuts", "Shellfish", "Dairy", "Eggs", "Cilantro", "Sesame", "Soy"]

export default function AllergiesInput({ value, onChange }: AllergiesInputProps) {
  const [input, setInput] = useState("")

  const addAllergy = (allergy: string) => {
    if (!value.includes(allergy)) {
      onChange([...value, allergy])
    }
  }

  const removeAllergy = (allergy: string) => {
    onChange(value.filter((a) => a !== allergy))
  }

  const handleAddCustom = () => {
    if (input.trim() && !value.includes(input.trim())) {
      onChange([...value, input.trim()])
      setInput("")
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-foreground">Allergies</label>

      {/* Selected Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((allergy) => (
            <div
              key={allergy}
              className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium"
            >
              {allergy}
              <button onClick={() => removeAllergy(allergy)} className="hover:text-primary/70">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Custom Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddCustom()}
          placeholder="Add custom allergy..."
          className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleAddCustom}
          className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-colors"
        >
          Add
        </button>
      </div>

      {/* Common Suggestions */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Common allergies:</p>
        <div className="flex flex-wrap gap-2">
          {COMMON_ALLERGIES.map((allergy) => (
            <button
              key={allergy}
              onClick={() => addAllergy(allergy)}
              disabled={value.includes(allergy)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                value.includes(allergy)
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
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
