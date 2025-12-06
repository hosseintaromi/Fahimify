"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import AddRecipeForm from "@/components/recipes/add-recipe-form"
import RecipeDetails from "@/components/recipes/recipe-details"
import BottomNavigation from "@/components/dashboard/bottom-navigation"

export default function RecipesPage() {
  const router = useRouter()
  const [showAddRecipe, setShowAddRecipe] = useState(false)
  const [showRecipeDetails, setShowRecipeDetails] = useState(false)

  const handleTabChange = (tab: string) => {
    if (tab === "home") {
      router.push("/")
      return
    }
    router.push(`/?tab=${tab}`)
  }

  if (showAddRecipe) {
    return <AddRecipeForm onBack={() => setShowAddRecipe(false)} />
  }

  if (showRecipeDetails) {
    return <RecipeDetails onBack={() => setShowRecipeDetails(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dff7ef] via-[#e7f5ff] to-white pb-20">
      <div className="sticky top-0 z-10 border-b border-white/70 bg-gradient-to-r from-white/95 via-white/90 to-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Library</p>
            <h1 className="text-3xl font-semibold text-slate-900">My Recipes</h1>
            <p className="text-sm text-slate-500">Save your own dishes or tweak Fahimify favorites.</p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={() => router.push("/")}>
            Close
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-5">
        <Button
          onClick={() => setShowAddRecipe(true)}
          className="w-full rounded-[28px] bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:from-teal-600 hover:to-blue-600"
        >
          Add New Recipe
        </Button>

        <div
          onClick={() => setShowRecipeDetails(true)}
          className="cursor-pointer overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_25px_60px_rgba(15,118,110,0.12)] transition hover:-translate-y-0.5"
        >
          <div className="h-48 overflow-hidden">
            <img src="/spicy-chickpea-curry.jpg" alt="Spicy Chickpea Curry" className="h-full w-full object-cover" />
          </div>
          <div className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-slate-900">Spicy Chickpea Curry</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Pinned</span>
            </div>
            <p className="text-sm text-slate-500">
              Indian • 45 min • €2.10 · Perfect for magnesium boost days and batch cooking.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Budget €</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Plant-based</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation currentTab="home" onTabChange={handleTabChange} />
    </div>
  )
}

