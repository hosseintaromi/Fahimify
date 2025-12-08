"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import NutrientBoost from "../inputs/nutrient-boost"
import type { OnboardingData } from "../onboarding-flow"

interface NutrientStepProps {
  boostNutrient: boolean
  priorityNutrient: string
  onSubmit: (data: OnboardingData) => Promise<void>
  data: OnboardingData
  onBack: () => void
  step: number
}

export default function NutrientStep({
  boostNutrient,
  priorityNutrient,
  onSubmit,
  data,
  onBack,
}: NutrientStepProps) {
  const [boost, setBoost] = useState(boostNutrient)
  const [nutrient, setNutrient] = useState(priorityNutrient)

  const handleComplete = async () => {
    await onSubmit({ ...data, boostNutrient: boost, priorityNutrient: nutrient })
  }

  return (
    <div className="space-y-8">
      <NutrientBoost enabled={boost} onEnabledChange={setBoost} nutrient={nutrient} onNutrientChange={setNutrient} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={onBack}
          className="flex-1 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        >
          Back
        </Button>
        <Button
          onClick={handleComplete}
          className="flex-1 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:from-teal-600 hover:to-blue-600"
        >
          Finish setup
        </Button>
      </div>
    </div>
  )
}
