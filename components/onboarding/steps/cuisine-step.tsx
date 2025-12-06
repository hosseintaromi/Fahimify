"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CuisinePrioritySelect from "../inputs/cuisine-priority-select"

interface CuisineStepProps {
  value: { style: string; priority: number }[]
  onNext: (fieldName: string, value: any) => void
  onBack: () => void
  step: number
}

export default function CuisineStep({ value, onNext, onBack }: CuisineStepProps) {
  const [selected, setSelected] = useState(value)

  return (
    <div className="space-y-8">
      <CuisinePrioritySelect value={selected} onChange={setSelected} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={onBack}
          className="flex-1 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        >
          Back
        </Button>
        <Button
          onClick={() => onNext("cuisines", selected)}
          className="flex-1 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:from-teal-600 hover:to-blue-600"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
