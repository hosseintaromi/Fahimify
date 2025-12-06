"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import BudgetSlider from "./inputs/budget-slider"
import HouseholdPicker from "./inputs/household-picker"
import AllergiesInput from "./inputs/allergies-input"
import CookingTimeSlider from "./inputs/cooking-time-slider"

interface ProfileStepProps {
  onNext: (data: any) => void
}

export default function ProfileStep({ onNext }: ProfileStepProps) {
  const [budget, setBudget] = useState(150)
  const [household, setHousehold] = useState(2)
  const [allergies, setAllergies] = useState<string[]>([])
  const [cookingTime, setCookingTime] = useState(30)

  const handleNext = () => {
    onNext({ budget, household, allergies, cookingTime })
  }

  return (
    <Card className="w-full max-w-md p-6 shadow-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tell Us About Your Eating Habits</h1>
          <p className="text-muted-foreground">Step 1 of 2</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2">
          <div className="flex-1 h-1 bg-primary rounded-full"></div>
          <div className="flex-1 h-1 bg-muted rounded-full"></div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-6">
          <BudgetSlider value={budget} onChange={setBudget} />
          <HouseholdPicker value={household} onChange={setHousehold} />
          <AllergiesInput value={allergies} onChange={setAllergies} />
          <CookingTimeSlider value={cookingTime} onChange={setCookingTime} />
        </div>

        {/* Navigation */}
        <Button
          onClick={handleNext}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2"
        >
          Next
        </Button>
      </div>
    </Card>
  )
}
