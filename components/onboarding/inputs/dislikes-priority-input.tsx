"use client"

import { useState } from "react"
import { X } from "lucide-react"

const COMMON_DISLIKES = ["Mushrooms", "Spicy", "Olives", "Onions", "Seafood", "Nuts", "Dairy", "Beans"]

interface DislikeItem {
  item: string
  priority: number
}

interface DislikesPriorityInputProps {
  value: DislikeItem[]
  onChange: (value: DislikeItem[]) => void
}

export default function DislikesPriorityInput({ value, onChange }: DislikesPriorityInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleAddDislike = (item: string) => {
    if (item && !value.some((d) => d.item === item)) {
      onChange([...value, { item, priority: 3 }])
      setInputValue("")
    }
  }

  const handleRemove = (item: string) => {
    onChange(value.filter((d) => d.item !== item))
  }

  const handlePriorityChange = (item: string, priority: number) => {
    onChange(value.map((d) => (d.item === item ? { ...d, priority } : d)))
  }

  return (
    <div className="space-y-6">
      {/* Input for adding dislikes */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a dislike..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddDislike(inputValue)
            }
          }}
          className="flex-1 px-4 py-2 border border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <button
          onClick={() => handleAddDislike(inputValue)}
          className="px-6 py-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold shadow-md shadow-emerald-200/60"
        >
          Add
        </button>
      </div>

      {/* Common suggestions */}
      <div className="space-y-2">
        <p className="text-sm text-slate-500 font-medium">Common dislikes:</p>
        <div className="flex flex-wrap gap-2">
          {COMMON_DISLIKES.map((item) => (
            <button
              key={item}
              onClick={() => handleAddDislike(item)}
              disabled={value.some((d) => d.item === item)}
              className={`px-3 py-1 rounded-full text-sm transition border ${
                value.some((d) => d.item === item)
                  ? "bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed"
                  : "bg-white border-slate-200 text-slate-600 hover:border-teal-200 hover:text-teal-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Selected dislikes with priority scale */}
      {value.length > 0 && (
        <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <p className="text-sm font-medium text-slate-600">Your dislikes (1 = least, 5 = most):</p>
          {value.map((dislike) => (
            <div key={dislike.item} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800">{dislike.item}</span>
                <button
                  onClick={() => handleRemove(dislike.item)}
                  className="text-slate-300 hover:text-rose-500 transition"
                >
                  <X size={18} />
                </button>
              </div>
              {/* Priority scale bar */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handlePriorityChange(dislike.item, level)}
                    className={`flex-1 h-2 rounded-full transition ${
                      level <= dislike.priority
                        ? "bg-gradient-to-r from-teal-500 to-sky-500"
                        : "bg-slate-200 hover:bg-slate-300"
                    }`}
                    title={`Priority ${level}`}
                  />
                ))}
              </div>
              <div className="text-right text-xs text-slate-500">Priority: {dislike.priority}/5</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
