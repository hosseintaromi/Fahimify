"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
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

const TABS = ["home", "plan", "nutrition", "nourish"] as const

export default function DashboardHome() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentTab, setCurrentTab] = useState<string>("home")
  const [showSettings, setShowSettings] = useState(false)
  const [showAddRecipe, setShowAddRecipe] = useState(false)
  const [showRecipeDetails, setShowRecipeDetails] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const [swapTarget, setSwapTarget] = useState<{ day: string; meal: string } | null>(null)
  const [plan, setPlan] = useState<WeeklyPlanResult | null>(null)
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam && TABS.includes(tabParam as (typeof TABS)[number]) && tabParam !== currentTab) {
      setCurrentTab(tabParam)
    }
  }, [searchParams, currentTab])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const profRes = await fetch("/api/profile")
      const prof = (await profRes.json()) as UserProfileData | null
      setProfile(prof)
      const planRes = await fetch("/api/plan", { method: "POST", body: JSON.stringify({ userId: "demo-user" }) })
      const planJson = (await planRes.json()) as WeeklyPlanResult
      setPlan(planJson)
      if (planJson?.days?.length) {
        const name = new Date(2024, 0, 1).toLocaleDateString("en-US", { weekday: "long" })
        setExpandedDay(name)
      }
      setLoading(false)
    }
    load()
  }, [])

  const toggleDay = (day: string) => {
    setExpandedDay((prev) => (prev === day ? null : day))
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

  const weeklyPlan:
    | { day: string; focus: string; meals: { type: string; recipe: string; duration: string; cost: string }[] }[]
    | [] =
    plan?.days?.map((day, idx) => ({
      day: new Date(2024, 0, 1 + idx).toLocaleDateString("en-US", { weekday: "long" }),
      focus: profile?.preferences?.boostNutrient ? `${profile.preferences.boostNutrient} focus` : "Balanced day",
      meals: day.meals.map((meal, mIdx) => ({
        type: ["Breakfast", "Lunch", "Dinner"][mIdx] ?? "Meal",
        recipe: meal.title,
        duration: `${meal.cookTime}m`,
        cost: `€${meal.price.toFixed(2)}`,
      })),
    })) ?? []

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
          {weeklyPlan.map((day) => {
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
                className={`rounded-[28px] border transition-all focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none ${
                  isOpen ? "border-teal-200 bg-white shadow-xl shadow-teal-500/10" : "border-transparent bg-white/70 hover:border-teal-100"
                }`}
              >
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{day.day}</p>
                    <p className="text-sm text-slate-500">{day.focus}</p>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isOpen ? "bg-teal-50 text-teal-600" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isOpen ? "Hide plan" : "View plan"}
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} size={20} />
                </div>
                {isOpen && (
                  <div className="border-t border-slate-100 p-5 space-y-5">
                    {day.meals.map((meal, idx) => (
                      <div
                        key={`${day.day}-${meal.type}-${idx}`}
                        className="rounded-3xl border border-white/80 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-400">{meal.type}</p>
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
                                setShowRecipeDetails(true)
                              }}
                              className="rounded-full border border-teal-100 px-4 py-2 text-xs font-semibold text-teal-600 transition hover:bg-teal-50"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation()
                                setSwapTarget({ day: day.day, meal: meal.recipe })
                              }}
                              className="rounded-full border border-teal-100 px-4 py-2 text-xs font-semibold text-teal-600 transition hover:bg-teal-50"
                            >
                              Swap meal
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
        {swapTarget && <SwapMealModal onClose={() => setSwapTarget(null)} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardHeader onSettingsClick={() => setShowSettings(true)} onProfileClick={() => setShowProfile(true)} />
      <div className="p-4 space-y-6">
        <DashboardCards
          budget={profile?.preferences?.budget}
          spent={plan?.totalCost}
          priority={profile?.preferences?.boostNutrient}
        />
        <TodaysPlan
          onRecipeClick={() => setShowRecipeDetails(true)}
          meals={
            plan?.days?.[0]?.meals?.map((m) => ({ title: m.title, cookTime: m.cookTime, price: m.price })) ?? []
          }
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
      {swapTarget && <SwapMealModal onClose={() => setSwapTarget(null)} />}
    </div>
  )
}
