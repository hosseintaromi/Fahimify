"use client"

import { useState } from "react"
import { ShoppingCart, ChefHat } from "lucide-react"
import SmartShoppingList from "./nourish/smart-shopping-list"
import MiseEnPlaceBuilder from "./nourish/mise-en-place-builder"

export default function NourishLabs() {
  const [selectedApp, setSelectedApp] = useState<"shopping" | "mise" | null>(null)

  if (selectedApp === "shopping") {
    return <SmartShoppingList onBack={() => setSelectedApp(null)} />
  }

  if (selectedApp === "mise") {
    return <MiseEnPlaceBuilder onBack={() => setSelectedApp(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dff7ef] via-[#e7f5ff] to-white pb-12">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Labs</p>
        <h2 className="text-3xl font-semibold text-slate-900">Nourish Labs</h2>
        <p className="text-sm text-slate-500">Smart kitchen tools for effortless prep.</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-5">
        <button
          onClick={() => setSelectedApp("shopping")}
          className="w-full rounded-[32px] border border-white/70 bg-white/90 p-6 text-left shadow-[0_25px_60px_rgba(15,118,110,0.12)] transition hover:-translate-y-0.5"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-sky-100 p-3">
              <ShoppingCart size={28} className="text-sky-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Smart Shopping List</h3>
              <p className="text-sm text-slate-500 mt-2">
                Ingredient-by-ingredient list with best-store recommendations and live price comparisons.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">AI-powered</span>
                <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold">Price optimized</span>
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setSelectedApp("mise")}
          className="w-full rounded-[32px] border border-white/70 bg-white/90 p-6 text-left shadow-[0_25px_60px_rgba(15,118,110,0.12)] transition hover:-translate-y-0.5"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-emerald-100 p-3">
              <ChefHat size={28} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Mise en Place Builder</h3>
              <p className="text-sm text-slate-500 mt-2">
                Weekend prep routines with guided steps, freezing tips, and suggested uses for each component.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">Time saver</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">Prep guide</span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
