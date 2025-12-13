"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronDown, Check } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import DashboardHeader from "./dashboard-header"
import DashboardCards from "./dashboard-cards"
import TodaysPlan from "./todays-plan"
import BottomNavigation from "./bottom-navigation"
import SettingsProfile from "@/components/settings/settings-profile"
import AddRecipeForm from "@/components/recipes/add-recipe-form"
import RecipeDetails from "@/components/recipes/recipe-details"
import NutritionTracking from "./nutrition-tracking"
import NourishLabs from "./nourish-labs"
import UserProfile from "@/components/dashboard/user-profile"
import SwapMealModal from "@/components/modals/swap-meal-modal"
import { Button } from "@/components/ui/button"
import type { DayPlan, WeeklyPlanResult } from "@/lib/fahimeh"
import type { UserProfileData } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TABS = ["home", "plan", "nutrition", "nourish"] as const

export default function DashboardHome() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentTab, setCurrentTab] = useState<string>("home")
  const [showSettings, setShowSettings] = useState(false)
  const [showAddRecipe, setShowAddRecipe] = useState(false)
  const [showRecipeDetails, setShowRecipeDetails] = useState(false)
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const [swapTarget, setSwapTarget] = useState<{ day: string; meal: string; dayIndex: number; mealIndex: number } | null>(null)
  const [plan, setPlan] = useState<WeeklyPlanResult | null>(null)
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  const [metrics, setMetrics] = useState({ age: 30, sex: "male", weightKg: 70, heightCm: 175, pal: 1.6, bodyType: "" })
  const [weeklySpending, setWeeklySpending] = useState<{ totalSpent: number; dailySpending: Record<string, number> }>({ totalSpent: 0, dailySpending: {} })
  const [eatenMeals, setEatenMeals] = useState<Set<string>>(new Set())

  const refreshSpending = useCallback(async () => {
    try {
      const spendingRes = await fetch("/api/meal-log", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      const spendingData = await spendingRes.json()
      setWeeklySpending({ totalSpent: spendingData.totalSpent || 0, dailySpending: spendingData.dailySpending || {} })
      const logs = spendingData.logs || []
      const eatenIds = new Set(logs.map((log: { recipeId: string }) => log.recipeId))
      setEatenMeals(eatenIds)
    } catch (err) {
      console.error("Failed to refresh spending:", err)
    }
  }, [])

  const loadData = async () => {
    setLoading(true)
    const profRes = await fetch("/api/profile")
    const prof = (await profRes.json()) as UserProfileData | null
    setProfile(prof)
    const planRes = await fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
    const planJson = (await planRes.json()) as WeeklyPlanResult
    setPlan(planJson)
    await refreshSpending()
    if (planJson?.days?.length) {
      const today = new Date()
      const todayName = today.toLocaleDateString("en-US", { weekday: "long" })
      setExpandedDay(todayName)
    }
    setLoading(false)
  }

  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam && TABS.includes(tabParam as (typeof TABS)[number]) && tabParam !== currentTab) {
      setCurrentTab(tabParam)
    }
  }, [searchParams, currentTab])

  useEffect(() => {
    if (currentTab === "home") {
      refreshSpending()
    }
  }, [currentTab, refreshSpending])

  useEffect(() => {
    loadData()

    const handleRouteChange = () => {
      refreshSpending()
    }

    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [refreshSpending])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshSpending()
      }
    }

    const handleFocus = () => {
      refreshSpending()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [refreshSpending])

  const toggleDay = (day: string) => {
    setExpandedDay((prev) => (prev === day ? null : day))
  }

  const openPlanModal = () => {
    setShowMetrics(false)
    setShowPlanModal(true)
  }

  const generateNewPlan = async () => {
    setLoading(true)
    setShowPlanModal(false)
    const planRes = await fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
    const planJson = (await planRes.json()) as WeeklyPlanResult
    setPlan(planJson)
    setLoading(false)
  }

  const bootstrapPlan = async (mode: "default" | "metrics") => {
    setLoading(true)
    setShowPlanModal(false)
    await fetch("/api/profile/bootstrap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body:
        mode === "default"
          ? JSON.stringify({ mode })
          : JSON.stringify({
            mode,
            ...metrics,
          }),
    })
    const profRes = await fetch("/api/profile")
    const prof = (await profRes.json()) as UserProfileData | null
    setProfile(prof)
    const planRes = await fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
    const planJson = (await planRes.json()) as WeeklyPlanResult
    setPlan(planJson)
    setLoading(false)
  }

  const handleMealEaten = async (meal: { recipeId: string; title: string; price: number; nutrients?: Record<string, number> }) => {
    await fetch("/api/meal-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipeId: meal.recipeId,
        recipeTitle: meal.title,
        cost: meal.price,
        nutrients: meal.nutrients || {},
      }),
    })
    await refreshSpending()
  }

  const handleSwapMeal = async (mealIndex: number, strategy: "cheaper" | "faster" | "nutrient") => {
    setLoading(true)
    const res = await fetch("/api/plan/swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dayIndex: 0,
        mealIndex,
        strategy,
      }),
    })
    const updatedPlan = (await res.json()) as WeeklyPlanResult
    setPlan(updatedPlan)
    setLoading(false)
  }

  const handleSwapFromWeeklyPlan = async (strategy: "cheaper" | "faster" | "nutrient") => {
    if (!swapTarget) return
    setLoading(true)
    const targetToSwap = swapTarget
    setSwapTarget(null)
    try {
      const res = await fetch("/api/plan/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayIndex: targetToSwap.dayIndex,
          mealIndex: targetToSwap.mealIndex,
          strategy,
        }),
      })
      if (!res.ok) {
        const error = await res.json()
        console.error("Swap failed:", error)
        alert(`Failed to swap meal: ${error.error || 'Unknown error'}`)
        setLoading(false)
        return
      }
      const updatedPlan = (await res.json()) as WeeklyPlanResult
      setPlan(updatedPlan)
    } catch (err) {
      console.error("Swap error:", err)
      alert("Failed to swap meal")
    }
    setLoading(false)
  }

  if (showProfile) {
    return <UserProfile onBack={() => setShowProfile(false)} />
  }

  const handleOpenRecipes = () => {
    router.push("/recipes")
  }

  if (showSettings) {
    return <SettingsProfile onBack={() => setShowSettings(false)} onOpenRecipes={handleOpenRecipes} />
  }

  if (showAddRecipe) {
    return <AddRecipeForm onBack={() => setShowAddRecipe(false)} />
  }

  if (showRecipeDetails) {
    return <RecipeDetails onBack={() => setShowRecipeDetails(false)} />
  }

  if (currentTab === "nutrition") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dff7ef] via-[#e7f5ff] to-white pb-20">
        <DashboardHeader onSettingsClick={() => setShowSettings(true)} onProfileClick={() => setShowProfile(true)} />
        <NutritionTracking />
        <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
      </div>
    )
  }

  if (currentTab === "nourish") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dff7ef] via-[#e7f5ff] to-white pb-20">
        <DashboardHeader onSettingsClick={() => setShowSettings(true)} onProfileClick={() => setShowProfile(true)} />
        <NourishLabs />
        <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground bg-gradient-to-br from-[#dff7ef] via-[#e7f5ff] to-white">
        Loading your plan...
      </div>
    )
  }

  const today = new Date()
  const todayDayOfWeek = today.getDay()

  const weeklyPlan:
    | { day: string; focus: string; meals: { type: string; recipe: string; duration: string; cost: string }[]; dayIndex: number }[]
    | [] =
    plan?.days
      ?.map((day, idx) => {
        const planDate = new Date(2024, 0, 1 + idx)
        const planDayOfWeek = planDate.getDay()
        return {
          day: planDate.toLocaleDateString("en-US", { weekday: "long" }),
          focus: profile?.preferences?.boostNutrient ? `${profile.preferences.boostNutrient} focus` : "Balanced day",
          meals: day.meals.map((meal, mIdx) => ({
            type: ["Breakfast", "Lunch", "Dinner"][mIdx] ?? "Meal",
            recipe: meal.title,
            duration: `${meal.cookTime}m`,
            cost: `€${meal.price.toFixed(2)}`,
          })),
          dayIndex: idx,
          planDayOfWeek,
        }
      })
      .filter((day) => {
        if (todayDayOfWeek === 0) return day.planDayOfWeek === 0
        return day.planDayOfWeek >= todayDayOfWeek || day.planDayOfWeek === 0
      }) ?? []

  if (currentTab === "plan") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#dff7ef] via-[#e7f5ff] to-white pb-20">
        <DashboardHeader onSettingsClick={() => setShowSettings(true)} onProfileClick={() => setShowProfile(true)} />
        <div className="mx-auto max-w-3xl px-4 py-8 space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Planning</p>
          <h2 className="text-3xl font-semibold text-slate-900">Weekly Plan</h2>
          <p className="text-sm text-slate-500">Tap a day to view meals, swap, or jump into details.</p>
        </div>
        <div className="mx-auto max-w-3xl px-4 space-y-4">
          {weeklyPlan.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/70 p-6 text-center text-slate-500 space-y-4">
              <p>No weekly plan yet.</p>
              <Button
                type="button"
                onClick={openPlanModal}
                className="rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white"
              >
                Generate weekly plan
              </Button>
            </div>
          ) : (
            weeklyPlan.map((day) => {
              const isOpen = expandedDay === day.day
              return (
                <div
                  key={day.day}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onClick={() => toggleDay(day.day)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      toggleDay(day.day)
                    }
                  }}
                  className={`rounded-[28px] border transition-all focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none ${isOpen ? "border-teal-200 bg-white shadow-xl shadow-teal-500/10" : "border-transparent bg-white/70 hover:border-teal-100"
                    }`}
                >
                  <div className="flex items-center justify-between gap-4 p-5">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{day.day}</p>
                      <p className="text-sm text-slate-500">{day.focus}</p>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${isOpen ? "bg-teal-50 text-teal-600" : "bg-slate-100 text-slate-500"
                        }`}
                    >
                      {isOpen ? "Hide plan" : "View plan"}
                    </div>
                    <ChevronDown className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} size={20} />
                  </div>
                  {isOpen && (
                    <div className="border-t border-slate-100 p-5 space-y-5">
                      {day.meals.map((meal, mealIdx) => {
                        const recipeId = plan?.days?.[day.dayIndex]?.meals?.[mealIdx]?.recipeId
                        const isEaten = recipeId ? eatenMeals.has(recipeId) : false

                        return (
                          <div
                            key={`${day.day}-${meal.type}-${mealIdx}`}
                            className={`rounded-3xl border px-4 py-4 shadow-sm transition hover:-translate-y-0.5 ${isEaten
                              ? "border-emerald-200 bg-emerald-50/50"
                              : "border-white/80 bg-white"
                              }`}
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-xs uppercase tracking-wide text-slate-400">{meal.type}</p>
                                  {isEaten && (
                                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                      <Check size={14} />
                                      Eaten
                                    </span>
                                  )}
                                </div>
                                <p className="text-lg font-semibold text-slate-900">{meal.recipe}</p>
                                <p className="text-xs text-slate-500">
                                  {meal.duration} • {meal.cost}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    if (recipeId) {
                                      router.push(`/recipe/${recipeId}`)
                                    }
                                  }}
                                  className="rounded-full border border-teal-100 px-4 py-2 text-xs font-semibold text-teal-600 transition hover:bg-teal-50"
                                >
                                  View
                                </button>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    setSwapTarget({ day: day.day, meal: meal.recipe, dayIndex: day.dayIndex, mealIndex: mealIdx })
                                  }}
                                  className="rounded-full border border-teal-100 px-4 py-2 text-xs font-semibold text-teal-600 transition hover:bg-teal-50"
                                >
                                  Swap meal
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
        <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
        {swapTarget && <SwapMealModal onClose={() => setSwapTarget(null)} onSwap={handleSwapFromWeeklyPlan} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardHeader onSettingsClick={() => setShowSettings(true)} onProfileClick={() => setShowProfile(true)} />
      <div className="p-4 space-y-6">
        <DashboardCards
          budget={profile?.preferences?.budget}
          spent={weeklySpending.totalSpent}
          priority={profile?.preferences?.boostNutrient}
          estimatedWeeklyCost={plan?.totalCost}
          dailySpending={weeklySpending.dailySpending}
        />
        {(!plan || !plan.days?.length) && (
          <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/80 p-5 shadow-sm text-center space-y-3">
            <p className="text-sm text-slate-600">No plan yet. Generate a weekly plan to see meals here.</p>
            <Button
              type="button"
              onClick={openPlanModal}
              className="rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white"
            >
              Generate weekly plan
            </Button>
          </div>
        )}
        <TodaysPlan
          onRecipeClick={(recipeId) => router.push(`/recipe/${recipeId}`)}
          meals={
            plan?.days?.[0]?.meals?.map((m) => ({
              recipeId: m.recipeId,
              title: m.title,
              cookTime: m.cookTime,
              price: m.price,
              nutrients: m.nutrients
            })) ?? []
          }
          onMealEaten={handleMealEaten}
          onSwapMeal={handleSwapMeal}
        />
        <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-lg space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Library</p>
            <h3 className="text-2xl font-semibold text-slate-900">My Recipes</h3>
            <p className="text-sm text-slate-500">
              Save your own dishes, pin Fahimify favorites, and tweak them whenever inspiration hits.
            </p>
          </div>
          <Button
            onClick={handleOpenRecipes}
            className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:from-teal-600 hover:to-blue-600"
          >
            Open My Recipes
          </Button>
        </div>
      </div>
      <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
      {swapTarget && <SwapMealModal onClose={() => setSwapTarget(null)} onSwap={handleSwapFromWeeklyPlan} />}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 space-y-4 shadow-xl">
            <div className="flex justify-end">
              <Button variant="ghost" type="button" onClick={() => setShowPlanModal(false)} className="text-slate-500">
                Close
              </Button>
            </div>
            {profile ? (
              <>
                <h3 className="text-xl font-semibold text-slate-900">Generate Weekly Plan</h3>
                <p className="text-sm text-slate-600">
                  Your plan will be generated based on your preferences (Budget: €
                  {profile.preferences?.budget ?? "…"}).
                </p>
                <Button
                  type="button"
                  className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white"
                  onClick={generateNewPlan}
                >
                  Generate Plan
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-slate-900">EU-based plan</h3>
                <p className="text-sm text-slate-600">
                  We generate your plan using EU DRV standards by default. You can continue or add your physical metrics to individualize targets.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    className="flex-1 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white"
                    onClick={() => bootstrapPlan("default")}
                  >
                    Continue with EU DRV
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="flex-1 rounded-2xl"
                    onClick={() => setShowMetrics((prev) => !prev)}
                  >
                    Add my metrics
                  </Button>
                </div>
                {showMetrics && (
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Age"
                      value={metrics.age}
                      onChange={(e) => setMetrics({ ...metrics, age: Number(e.target.value) })}
                    />
                    <Select
                      value={metrics.sex}
                      onValueChange={(val) => setMetrics({ ...metrics, sex: val as "male" | "female" })}
                    >
                      <SelectTrigger><SelectValue placeholder="Sex" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Weight (kg)"
                      value={metrics.weightKg}
                      onChange={(e) => setMetrics({ ...metrics, weightKg: Number(e.target.value) })}
                    />
                    <Input
                      type="number"
                      placeholder="Height (cm)"
                      value={metrics.heightCm}
                      onChange={(e) => setMetrics({ ...metrics, heightCm: Number(e.target.value) })}
                    />
                    <Input
                      type="number"
                      placeholder="PAL (1.2 - 2.4)"
                      value={metrics.pal}
                      onChange={(e) => setMetrics({ ...metrics, pal: Number(e.target.value) })}
                    />
                    <Input
                      type="text"
                      placeholder="Body type (optional)"
                      value={metrics.bodyType}
                      onChange={(e) => setMetrics({ ...metrics, bodyType: e.target.value })}
                    />
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowPlanModal(false)} className="rounded-2xl">
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white"
                        onClick={() => bootstrapPlan("metrics")}
                      >
                        Generate with metrics
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
