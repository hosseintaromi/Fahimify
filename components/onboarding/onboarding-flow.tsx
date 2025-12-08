"use client"

import { useState } from "react"
import BudgetStep from "./steps/budget-step"
import AllergiesStep from "./steps/allergies-step"
import DislikesStep from "./steps/dislikes-step"
import CookingTimeStep from "./steps/cooking-time-step"
import DietTypeStep from "./steps/diet-type-step"
import CuisineStep from "./steps/cuisine-step"
import NutrientStep from "./steps/nutrient-step"
import MealsPerDayStep from "./steps/meals-per-day-step"

export interface OnboardingData {
  budget: number
  allergies: string[]
  dislikes: { item: string; priority: number }[]
  cookingTime: number
  mealsPerDay: number
  snacksPerDay: number
  dietType: string
  cuisines: { style: string; priority: number }[]
  boostNutrient: boolean
  priorityNutrient: string
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
}

const STEPS = [
  "budget",
  "allergies",
  "dislikes",
  "cookingTime",
  "mealsPerDay",
  "dietType",
  "cuisines",
  "nutrient",
] as const

type StepType = (typeof STEPS)[number]

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    budget: 150,
    allergies: [],
    dislikes: [],
    cookingTime: 30,
    mealsPerDay: 3,
    snacksPerDay: 0,
    dietType: "Omnivore",
    cuisines: [],
    boostNutrient: false,
    priorityNutrient: "",
  })

  const currentStep = STEPS[currentStepIndex]
  const totalSteps = STEPS.length
  const progress = ((currentStepIndex + 1) / totalSteps) * 100

  const handleNext = async (fieldName: string, value: any) => {
    const nextData = { ...data, [fieldName]: value }
    setData(nextData)
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    } else {
      await submitOnboarding(nextData)
    }
  }

  const submitOnboarding = async (payload: OnboardingData) => {
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, userId: "demo-user" }),
    })
    onComplete(payload)
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e9] via-[#e3f2fd] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 pt-4 text-center">
          <h1 className="text-4xl font-bold text-foreground">Fahimify</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#0077B6] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Question {currentStepIndex + 1} of {totalSteps}
          </p>
        </div>

        {/* Step Components */}
        {currentStep === "budget" && (
          <BudgetStep value={data.budget} onNext={handleNext} onBack={handleBack} step={currentStepIndex} />
        )}
        {currentStep === "allergies" && (
          <AllergiesStep value={data.allergies} onNext={handleNext} onBack={handleBack} step={currentStepIndex} />
        )}
        {currentStep === "dislikes" && (
          <DislikesStep value={data.dislikes} onNext={handleNext} onBack={handleBack} step={currentStepIndex} />
        )}
        {currentStep === "cookingTime" && (
          <CookingTimeStep value={data.cookingTime} onNext={handleNext} onBack={handleBack} step={currentStepIndex} />
        )}
        {currentStep === "mealsPerDay" && (
          <MealsPerDayStep
            mealsPerDay={data.mealsPerDay}
            snacksPerDay={data.snacksPerDay}
            onNext={handleNext}
            onBack={handleBack}
            step={currentStepIndex}
          />
        )}
        {currentStep === "dietType" && (
          <DietTypeStep value={data.dietType} onNext={handleNext} onBack={handleBack} step={currentStepIndex} />
        )}
        {currentStep === "cuisines" && (
          <CuisineStep value={data.cuisines} onNext={handleNext} onBack={handleBack} step={currentStepIndex} />
        )}
        {currentStep === "nutrient" && (
          <NutrientStep
            boostNutrient={data.boostNutrient}
            priorityNutrient={data.priorityNutrient}
            onSubmit={submitOnboarding}
            data={data}
            onBack={handleBack}
            step={currentStepIndex}
          />
        )}
      </div>
    </div>
  )
}
