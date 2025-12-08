"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import BudgetSlider from "@/components/budget-slider"
import AllergiesInput from "@/components/allergies-input"
import CookingTimeSlider from "@/components/cooking-time-slider"

export default function OnboardingForm() {
  const [budget, setBudget] = useState(300)
  const [allergies, setAllergies] = useState<string[]>([])
  const [cookingTime, setCookingTime] = useState(30)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = () => {
    setIsSubmitted(true)
    console.log({
      budget,
      allergies,
      cookingTime,
    })
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2 text-balance">
            Tell Us About Your Eating Habits
          </h1>
          <p className="text-sm text-muted-foreground">Help us personalize your meal planning experience</p>
        </div>

        {/* Form Sections */}
        <div className="space-y-8">
          {/* Budget Slider */}
          <BudgetSlider value={budget} onChange={setBudget} />

          {/* Allergies Input */}
          <AllergiesInput value={allergies} onChange={setAllergies} />

          {/* Cooking Time Slider */}
          <CookingTimeSlider value={cookingTime} onChange={setCookingTime} />
        </div>

        {/* Submit Button */}
        <div className="mt-10">
          <Button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-colors"
          >
            Next
          </Button>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">✓ Profile preferences saved successfully!</p>
          </div>
        )}
      </div>
    </div>
  )
}
