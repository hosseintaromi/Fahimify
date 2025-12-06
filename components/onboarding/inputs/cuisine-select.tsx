"use client"

interface CuisineSelectProps {
  value: string[]
  onChange: (value: string[]) => void
}

const CUISINES = ["Italian", "Persian", "Turkish", "Chinese", "Indian", "Mexican", "Thai", "French"]

export default function CuisineSelect({ value, onChange }: CuisineSelectProps) {
  const toggleCuisine = (cuisine: string) => {
    if (value.includes(cuisine)) {
      onChange(value.filter((c) => c !== cuisine))
    } else {
      onChange([...value, cuisine])
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-foreground">Preferred Cuisine Styles</label>
      <div className="flex flex-wrap gap-2">
        {CUISINES.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => toggleCuisine(cuisine)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              value.includes(cuisine)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {cuisine}
          </button>
        ))}
      </div>
    </div>
  )
}
