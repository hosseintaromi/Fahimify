"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface MealsPerDayStepProps {
  mealsPerDay: number
  snacksPerDay: number
  onNext: (fieldName: string, value: any, shouldAdvance?: boolean) => void
  onBack: () => void
  step: number
}

export default function MealsPerDayStep({ mealsPerDay, snacksPerDay, onNext, onBack, step }: MealsPerDayStepProps) {
  const [mainMeals, setMainMeals] = useState(mealsPerDay)
  const [snacks, setSnacks] = useState(snacksPerDay)
  const [hasSnacks, setHasSnacks] = useState(snacksPerDay > 0)

  const handleNext = () => {
    onNext("mealsPerDay", mainMeals)
    onNext("snacksPerDay", hasSnacks ? snacks : 0, false)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm font-semibold text-slate-500">Meals per day</p>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setMainMeals(num)}
              className={`py-4 rounded-2xl border font-semibold text-lg transition-all ${
                mainMeals === num
                  ? "border-transparent bg-gradient-to-r from-teal-500 to-sky-500 text-white shadow-lg shadow-teal-500/30"
                  : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:text-teal-600"
              }`}
            >
              {num} {num === 1 ? "Meal" : "Meals"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hasSnacks}
            onChange={(e) => {
              setHasSnacks(e.target.checked)
              if (!e.target.checked) setSnacks(0)
            }}
            className="w-5 h-5 rounded border-slate-300"
          />
          <span className="text-base font-semibold text-slate-900">Include snacks</span>
        </label>

        {hasSnacks && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500">How many snacks per day?</p>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setSnacks(num)}
                  className={`py-3 rounded-2xl border font-semibold transition-all ${
                    snacks === num
                      ? "border-transparent bg-gradient-to-r from-emerald-400 to-lime-400 text-emerald-950 shadow-lg shadow-emerald-400/30"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
                  }`}
                >
                  {num} {num === 1 ? "Snack" : "Snacks"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={onBack}
          className="flex-1 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:from-teal-600 hover:to-blue-600"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
