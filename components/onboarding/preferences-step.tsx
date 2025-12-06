"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DietTypeSelect from "./inputs/diet-type-select"
import CuisineSelect from "./inputs/cuisine-select"
import NutrientBoost from "./inputs/nutrient-boost"

interface PreferencesStepProps {
  onComplete: (data: any) => void
  onBack: () => void
}

export default function PreferencesStep({ onComplete, onBack }: PreferencesStepProps) {
  const [dietType, setDietType] = useState("Omnivore")
  const [cuisines, setCuisines] = useState<string[]>([])
  const [boostNutrient, setBoostNutrient] = useState(false)
  const [priorityNutrient, setPriorityNutrient] = useState("")

  const handleComplete = () => {
    onComplete({ dietType, cuisines, boostNutrient, priorityNutrient })
  }

  return (
    <Card className="w-full max-w-md p-6 shadow-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Food Preferences</h1>
          <p className="text-muted-foreground">Step 2 of 2</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2">
          <div className="flex-1 h-1 bg-primary rounded-full"></div>
          <div className="flex-1 h-1 bg-primary rounded-full"></div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-6">
          <DietTypeSelect value={dietType} onChange={setDietType} />
          <CuisineSelect value={cuisines} onChange={setCuisines} />
          <NutrientBoost
            enabled={boostNutrient}
            onEnabledChange={setBoostNutrient}
            nutrient={priorityNutrient}
            onNutrientChange={setPriorityNutrient}
          />
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
            Back
          </Button>
          <Button
            onClick={handleComplete}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Finish Setup
          </Button>
        </div>
      </div>
    </Card>
  )
}
