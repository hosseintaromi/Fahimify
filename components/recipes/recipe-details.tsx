"use client"

import { useState } from "react"
import { ArrowLeft, Clock, Euro } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecipeDetailsProps {
  onBack: () => void
}

export default function RecipeDetails({ onBack }: RecipeDetailsProps) {
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions" | "nutrition">("ingredients")

  const ingredients = [
    { name: "Chickpeas (canned)", quantity: "400g", store: "Lidl", price: "€0.89" },
    { name: "Onion", quantity: "1 large", store: "Aldi", price: "€0.45" },
    { name: "Garlic", quantity: "3 cloves", store: "Local", price: "€0.15" },
    { name: "Coconut milk", quantity: "400ml", store: "Lidl", price: "€1.20" },
    { name: "Tomato paste", quantity: "2 tbsp", store: "Aldi", price: "€0.60" },
    { name: "Spices (cumin, turmeric, chili)", quantity: "to taste", store: "Home", price: "€0.00" },
  ]

  const instructions = [
    "Heat oil in a large pan over medium heat",
    "Sauté onions and garlic until fragrant",
    "Add tomato paste and cook for 1 minute",
    "Stir in chickpeas and spices, cook for 2 minutes",
    "Pour in coconut milk and bring to simmer",
    "Simmer for 20 minutes until flavors meld",
    "Taste and adjust seasonings as needed",
    "Serve hot with rice or bread",
  ]

  const nutritionData = {
    carbs: "42g",
    proteins: "15g",
    fats: "12g",
    vitamins: {
      a: "156 IU",
      b6: "0.3mg",
      b12: "0μg",
      c: "4mg",
      d: "0μg",
      e: "1.2mg",
      k: "3.5μg",
    },
    minerals: {
      iron: "4.2mg",
      calcium: "102mg",
      potassium: "523mg",
      magnesium: "85mg",
      zinc: "1.8mg",
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff7ef] via-white to-white pb-16">
      <div className="relative h-72 w-full overflow-hidden rounded-b-[40px] shadow-lg">
        <img src="/spicy-chickpea-curry-dish-food-photography.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
        <button
          onClick={onBack}
          className="absolute left-4 top-4 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
        >
          <ArrowLeft size={24} className="text-slate-700" />
        </button>
        <div className="absolute bottom-6 left-6 space-y-3 text-white">
          <h1 className="text-3xl font-semibold">Spicy Chickpea Curry</h1>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-white/90 px-3 py-1 text-slate-700">Cuisine: Indian</span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-emerald-600">High in Iron</span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-slate-500">System Optimized</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-3xl space-y-6 px-4">
        <div className="flex flex-wrap gap-4 rounded-[32px] bg-white/80 px-6 py-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock size={18} className="text-teal-500" />
            <span>Cook Time: 45 min</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Euro size={18} className="text-teal-500" />
            <span>Estimated Cost: €2.10</span>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/90 p-2 shadow-sm">
          <div className="flex gap-2 rounded-[28px] bg-slate-100 p-1 text-sm font-semibold text-slate-500">
            {(["ingredients", "instructions", "nutrition"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-[24px] px-4 py-2 transition ${
                  activeTab === tab ? "bg-white text-teal-600 shadow" : "hover:text-teal-500"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === "ingredients" && (
              <div className="space-y-3">
                {ingredients.map((ing) => (
                  <label key={ing.name} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="h-5 w-5 rounded border-slate-300 text-teal-500" />
                      <div>
                        <p className="font-semibold text-slate-900">{ing.name}</p>
                        <p className="text-xs text-slate-500">{ing.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      <p>{ing.store}</p>
                      <p className="font-semibold text-slate-900">{ing.price}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {activeTab === "instructions" && (
              <div className="space-y-4">
                {instructions.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-2xl border border-slate-100 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-teal-500 to-sky-500 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <p className="leading-relaxed text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "nutrition" && (
              <div className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <StatCard label="Carbs" value={nutritionData.carbs} color="text-teal-600" />
                  <StatCard label="Protein" value={nutritionData.proteins} color="text-indigo-600" />
                  <StatCard label="Fat" value={nutritionData.fats} color="text-emerald-600" />
                </div>
                <SectionList title="Vitamins" data={nutritionData.vitamins} />
                <SectionList title="Minerals" data={nutritionData.minerals} />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-sm">
          <Button className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:from-teal-600 hover:to-blue-600">
            Mark as eaten
          </Button>
          <button className="w-full rounded-2xl border border-teal-100 px-4 py-3 text-sm font-semibold text-teal-600 transition hover:bg-teal-50">
            Swap this meal
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}

function SectionList({ title, data }: { title: string; data: Record<string, string> }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm">
            <span className="capitalize text-slate-700">{title === "Vitamins" ? `Vitamin ${key.toUpperCase()}` : key}</span>
            <span className="text-slate-500">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
