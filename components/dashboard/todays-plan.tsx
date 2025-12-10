"use client"

import { Clock, Euro, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import SwapMealModal from "@/components/modals/swap-meal-modal"

interface TodaysPlanProps {
  onRecipeClick: (recipeId: string) => void
  meals?: { recipeId: string; title: string; cookTime: number; price: number; cuisine?: string; nutrients?: Record<string, number> }[]
  onMealEaten?: (meal: { recipeId: string; title: string; price: number; nutrients?: Record<string, number> }) => void
  onSwapMeal?: (mealIndex: number, strategy: "cheaper" | "faster" | "nutrient") => void
}

export default function TodaysPlan({ onRecipeClick, meals = [], onMealEaten, onSwapMeal }: TodaysPlanProps) {
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [eatenMeals, setEatenMeals] = useState<Set<string>>(new Set())
  const breakfast = meals[0]
  const lunch = meals[1]
  const dinner = meals[2]
  const hasMeals = meals.length > 0

  useEffect(() => {
    const fetchEatenMeals = async () => {
      try {
        const res = await fetch("/api/meal-log", {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        if (res.ok) {
          const data = await res.json()
          const logs = data.logs || []
          const eatenIds = new Set(logs.map((log: { recipeId: string }) => log.recipeId))
          setEatenMeals(eatenIds)
        }
      } catch (err) {
        console.error("Failed to fetch eaten meals:", err)
      }
    }
    fetchEatenMeals()
  }, [])

  const handleMarkAsEaten = (meal: { recipeId: string; title: string; price: number; nutrients?: Record<string, number> }) => {
    setEatenMeals(prev => new Set(prev).add(meal.recipeId))
    if (onMealEaten) {
      onMealEaten(meal)
    }
  }

  const handleSwap = (strategy: "cheaper" | "faster" | "nutrient") => {
    if (onSwapMeal) {
      onSwapMeal(2, strategy)
    }
  }

  const MealItem = ({
    meal,
    mealType,
    mealIndex
  }: {
    meal?: { recipeId: string; title: string; cookTime: number; price: number; cuisine?: string; nutrients?: Record<string, number> },
    mealType: string,
    mealIndex: number
  }) => {
    const isEaten = meal ? eatenMeals.has(meal.recipeId) : false

    return (
      <div
        className={`rounded-2xl border p-4 transition ${isEaten
          ? "border-emerald-200 bg-emerald-50/50"
          : "border-slate-200 bg-white hover:border-teal-200"
          } ${meal ? "cursor-pointer" : "opacity-50"}`}
        onClick={meal ? () => onRecipeClick(meal.recipeId) : undefined}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {mealType}
              </span>
              {isEaten && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <Check size={14} />
                  Eaten
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-900 truncate">
              {meal?.title ?? "Not planned"}
            </h3>
            {meal && (
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {meal.cookTime}m
                </span>
                <span className="flex items-center gap-1">
                  <Euro size={14} />
                  {meal.price.toFixed(2)}
                </span>
              </div>
            )}
          </div>
          {meal && !isEaten && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleMarkAsEaten(meal)
              }}
              className="rounded-xl bg-gradient-to-r from-teal-500 to-sky-500 text-white text-xs px-3 py-1 h-auto hover:from-teal-600 hover:to-blue-600"
            >
              Mark
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/70">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Today&apos;s plan</p>
            <h2 className="text-2xl font-semibold text-slate-900">Your meals</h2>
          </div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-600">Balanced</span>
        </div>
        <div className="space-y-3">
          <MealItem meal={breakfast} mealType="Breakfast" mealIndex={0} />
          <MealItem meal={lunch} mealType="Lunch" mealIndex={1} />
          <MealItem meal={dinner} mealType="Dinner" mealIndex={2} />
        </div>
      </div>

      <div
        className={`rounded-[32px] border border-white/60 bg-white/90 overflow-hidden shadow-[0_25px_60px_rgba(15,118,110,0.12)] ${hasMeals ? "transition hover:-translate-y-0.5 cursor-pointer" : ""
          }`}
        onClick={hasMeals && dinner ? () => onRecipeClick(dinner.recipeId) : undefined}
      >
        {hasMeals ? (
          <>
            <div className="relative h-44 overflow-hidden">
              <img
                src="/spicy-chickpea-curry-dish-food-photography.jpg"
                alt={dinner?.title ?? "Dinner"}
                className="w-full h-full object-cover transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-teal-500">Dinner suggestion</span>
                  <span className="text-xs text-slate-400">{dinner ? `Ready in ${dinner.cookTime} min` : "Ready soon"}</span>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">{dinner?.title ?? "Today’s dinner"}</h3>
                <p className="text-sm text-slate-500">Smart pick based on your nutrient and budget targets.</p>
                <div className="flex gap-2 flex-wrap">
                  {dinner?.cuisine && (
                    <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
                      {dinner.cuisine}
                    </span>
                  )}
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">
                    Balanced pick
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={18} />
                  <span>Cook time: {dinner ? `${dinner.cookTime}m` : "TBD"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Euro size={18} />
                  <span>Cost: €{dinner ? dinner.price.toFixed(2) : "0.00"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row" onClick={(e) => e.stopPropagation()}>
                {dinner && !eatenMeals.has(dinner.recipeId) ? (
                  <Button
                    onClick={() => handleMarkAsEaten(dinner)}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:from-teal-600 hover:to-blue-600"
                  >
                    Mark as Eaten
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="flex-1 rounded-2xl bg-emerald-100 text-emerald-700 font-semibold"
                  >
                    <Check size={18} className="mr-2" />
                    Logged
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowSwapModal(true)}
                  className="flex-1 rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                >
                  Swap Meal
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-5 space-y-3 text-center text-slate-500">
            <p className="text-sm font-semibold text-slate-700">No dinner suggestion yet</p>
            <p className="text-xs">Add recipes and generate a plan to see dinner details here.</p>
          </div>
        )}
      </div>

      {showSwapModal && <SwapMealModal onClose={() => setShowSwapModal(false)} onSwap={handleSwap} />}
    </div>
  )
}
