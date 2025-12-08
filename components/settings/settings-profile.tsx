"use client"

import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import BudgetSlider from "@/components/onboarding/inputs/budget-slider"
import CookingTimeSlider from "@/components/onboarding/inputs/cooking-time-slider"
import DietTypeSelect from "@/components/onboarding/inputs/diet-type-select"
import CuisineSelect from "@/components/onboarding/inputs/cuisine-select"
import NutrientBoost from "@/components/onboarding/inputs/nutrient-boost"
import AllergiesInput from "@/components/onboarding/inputs/allergies-input"

interface SettingsProfileProps {
  onBack: () => void
  onOpenRecipes: () => void
}

export default function SettingsProfile({ onBack, onOpenRecipes }: SettingsProfileProps) {
  const [hasChanges, setHasChanges] = useState(false)
  const [budget, setBudget] = useState(150)
  const [cookingTime, setCookingTime] = useState(30)
  const [allergies, setAllergies] = useState<string[]>(["Peanuts"])
  const [dietType, setDietType] = useState("Omnivore")
  const [cuisines, setCuisines] = useState<string[]>(["Italian", "Indian"])
  const [boostNutrient, setBoostNutrient] = useState(true)
  const [priorityNutrient, setPriorityNutrient] = useState("Magnesium")

  const handleSave = () => {
    setHasChanges(false)
    // API call would go here
  }

  const trackChange = () => {
    setHasChanges(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dff7ef] via-[#e7f5ff] to-white pb-20">
      <div className="sticky top-0 z-10 border-b border-white/70 bg-gradient-to-r from-white/95 via-white/90 to-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <button onClick={onBack} className="rounded-2xl bg-white/80 p-2 shadow-sm transition hover:bg-white">
            <ArrowLeft size={24} className="text-slate-700" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Profile</p>
            <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">My preferences</p>
          <h2 className="text-2xl font-semibold text-slate-900">Personalize your kitchen rules</h2>
          <p className="text-sm text-slate-500">Adjust budget, timing, cuisines, and nutrition targets. Changes autosave when you hit “Save”.</p>
        </div>

        <div className="space-y-5">
          <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-lg space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Budget</p>
              <h3 className="text-xl font-semibold text-slate-900">Weekly food budget</h3>
              <p className="text-sm text-slate-500">Tell Fahimify how much you’d like to spend each week.</p>
            </div>
            <div onChange={trackChange}>
              <BudgetSlider value={budget} onChange={setBudget} />
            </div>
          </div>

            <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Timing</p>
              <h3 className="text-lg font-semibold text-slate-900">Maximum cook time</h3>
              <p className="text-sm text-slate-500">Tap a tile to update your preferred prep window.</p>
              <div className="mt-4" onChange={trackChange}>
                <CookingTimeSlider value={cookingTime} onChange={setCookingTime} />
            </div>
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-lg space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-sm space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Diet</p>
                <h3 className="text-lg font-semibold text-slate-900">Your diet type</h3>
                <div onChange={trackChange}>
                  <DietTypeSelect value={dietType} onChange={setDietType} />
                </div>
              </div>
              <div className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-sm space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Cuisines</p>
                <h3 className="text-lg font-semibold text-slate-900">Preferred styles</h3>
                <div onChange={trackChange}>
                  <CuisineSelect value={cuisines} onChange={setCuisines} />
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-sm space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Allergies & dislikes</p>
                  <div onChange={trackChange}>
                    <AllergiesInput value={allergies} onChange={setAllergies} />
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Nutrient boost</p>
                  <div onChange={trackChange}>
                    <NutrientBoost
                      enabled={boostNutrient}
                      onEnabledChange={setBoostNutrient}
                      nutrient={priorityNutrient}
                      onNutrientChange={setPriorityNutrient}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-lg space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Library</p>
            <h3 className="text-2xl font-semibold text-slate-900">My Recipes</h3>
            <p className="text-sm text-slate-500">Add originals, remix Fahimify dishes, and keep your favorites handy.</p>
          </div>
          <Button
            onClick={onOpenRecipes}
            className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:from-teal-600 hover:to-blue-600"
          >
            Open My Recipes
          </Button>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-lg space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Account</p>
            <h3 className="text-2xl font-semibold text-slate-900">Security & access</h3>
          </div>
          <button className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-left font-semibold text-slate-700 transition hover:bg-slate-50">
            Change Password
          </button>
          <button className="w-full rounded-2xl border border-red-100 bg-red-50/60 px-4 py-3 text-left font-semibold text-red-600 transition hover:bg-red-50">
            Log Out
          </button>
        </div>

        {hasChanges && (
          <div className="sticky bottom-4 left-0 right-0">
            <Button
              onClick={handleSave}
              className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold py-3 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30"
            >
              <Save size={20} />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
