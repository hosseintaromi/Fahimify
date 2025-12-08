"use client"

import { Clock, Euro } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import SwapMealModal from "@/components/modals/swap-meal-modal"

interface TodaysPlanProps {
  onRecipeClick: () => void
  meals?: { title: string; cookTime: number; price: number; cuisine?: string }[]
}

export default function TodaysPlan({ onRecipeClick, meals = [] }: TodaysPlanProps) {
  const [showSwapModal, setShowSwapModal] = useState(false)
  const breakfast = meals[0]
  const lunch = meals[1]
  const dinner = meals[2]

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/70">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Today&apos;s plan</p>
            <h2 className="text-2xl font-semibold text-slate-900">Your meals</h2>
          </div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-600">Balanced</span>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <p className="text-slate-600">
            <span className="font-semibold text-slate-900">Breakfast:</span> {breakfast?.title ?? "Pending"}
          </p>
          <p className="text-slate-600">
            <span className="font-semibold text-slate-900">Lunch:</span> {lunch?.title ?? "Pending"}
          </p>
          <p className="text-slate-600">
            <span className="font-semibold text-slate-900">Dinner:</span> {dinner?.title ?? "Pending"}
          </p>
        </div>
      </div>

      <div
        className="rounded-[32px] border border-white/60 bg-white/90 overflow-hidden shadow-[0_25px_60px_rgba(15,118,110,0.12)] transition hover:-translate-y-0.5 cursor-pointer"
        onClick={onRecipeClick}
      >
        <div className="relative h-44 overflow-hidden">
          <img
            src="/spicy-chickpea-curry-dish-food-photography.jpg"
            alt="Spicy Chickpea Curry"
            className="w-full h-full object-cover transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-teal-500">Dinner suggestion</span>
            <span className="text-xs text-slate-400">
              {dinner ? `Ready in ${dinner.cookTime} min` : "Ready soon"}
            </span>
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
            <Button className="flex-1 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:from-teal-600 hover:to-blue-600">
              Start Cooking
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSwapModal(true)}
              className="flex-1 rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              Swap Meal
            </Button>
          </div>
        </div>
      </div>

      {showSwapModal && <SwapMealModal onClose={() => setShowSwapModal(false)} />}
    </div>
  )
}
