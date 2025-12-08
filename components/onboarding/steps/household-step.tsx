"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import HouseholdPicker from "../inputs/household-picker"

interface HouseholdStepProps {
  value: number
  onNext: (fieldName: string, value: any) => void
  onBack: () => void
  step: number
}

export default function HouseholdStep({ value, onNext, onBack, step }: HouseholdStepProps) {
  const [selected, setSelected] = useState(value)

  return (
    <div className="space-y-6">
      <HouseholdPicker value={selected} onChange={setSelected} />
      <div className="flex flex-col gap-3 sm:flex-row">
        {step > 0 ? (
          <Button
            onClick={onBack}
            className="flex-1 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            Back
          </Button>
        ) : (
          <div className="flex-1" />
        )}
        <Button
          onClick={() => onNext("household", selected)}
          className="flex-1 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:from-teal-600 hover:to-blue-600"
        >
          Next
        </Button>
      </div>
    </div>
  )
}



