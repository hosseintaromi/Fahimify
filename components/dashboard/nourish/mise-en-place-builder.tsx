"use client"

import { ArrowLeft, Clock, Thermometer } from "lucide-react"

interface MiseEnPlaceBuilderProps {
  onBack: () => void
}

export default function MiseEnPlaceBuilder({ onBack }: MiseEnPlaceBuilderProps) {
  const prepItems = [
    {
      name: "Tomato-Garlic Base",
      description: "Sautéed onions, garlic, and tomatoes",
      prep_time: "15 mins",
      yield: "4 portions",
      storage: "Freeze up to 3 months",
      ingredients: ["2 onions", "6 cloves garlic", "4 cans tomatoes", "2 tbsp oil"],
      steps: [
        "Chop onions and garlic finely",
        "Heat oil in large pan over medium heat",
        "Sauté onions until golden (5 mins)",
        "Add garlic, cook for 1 minute",
        "Add tomatoes and simmer for 8 minutes",
        "Cool completely before portioning",
        "Freeze in ice cube trays or containers",
      ],
      uses: ["Curries", "Pasta sauces", "Soups", "Stews"],
    },
    {
      name: "Spice Blend Mix",
      description: "Balanced curry spice blend",
      prep_time: "5 mins",
      yield: "8 portions",
      storage: "Keep in airtight container",
      ingredients: ["2 tbsp cumin", "1 tbsp coriander", "1 tbsp turmeric", "1 tbsp ginger", "½ tbsp cayenne"],
      steps: ["Measure all spices", "Mix thoroughly in bowl", "Store in airtight container", "Use 1 portion per meal"],
      uses: ["Curries", "Roasted vegetables", "Rice dishes", "Marinades"],
    },
    {
      name: "Vegetable Stock",
      description: "Homemade veggie broth",
      prep_time: "30 mins (mostly simmering)",
      yield: "2L (8 portions)",
      storage: "Freeze up to 6 months",
      ingredients: ["Vegetable scraps", "2 onions", "4 carrots", "4 celery stalks", "Herbs (thyme, bay leaf)"],
      steps: [
        "Roughly chop all vegetables",
        "Heat pot with water",
        "Add all vegetables and herbs",
        "Bring to boil, then simmer 20 mins",
        "Strain through colander",
        "Cool and portion for freezing",
      ],
      uses: ["Soups", "Risotto", "Rice dishes", "Sauces"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dff7ef] via-[#e7f5ff] to-white pb-12">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-8">
        <button onClick={onBack} className="rounded-2xl bg-white/80 p-2 shadow">
          <ArrowLeft size={24} className="text-slate-700" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Labs</p>
          <h1 className="text-3xl font-semibold text-slate-900">Mise en Place Builder</h1>
          <p className="text-sm text-slate-500">Weekend prep guide for the week ahead.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-5">
        <div className="rounded-[32px] border border-white/70 bg-white/90 p-5 shadow">
          <h3 className="text-lg font-semibold text-slate-900">⏰ Batch prep overview</h3>
          <p className="mt-2 text-sm text-slate-500">
            Prepare these bases once, then plug them into meals throughout the week to stay ahead.
          </p>
        </div>

        {prepItems.map((item, index) => (
          <div key={index} className="rounded-[32px] border border-white/70 bg-white/90 p-5 shadow space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Prep kit</p>
              <h3 className="text-2xl font-semibold text-slate-900">{item.name}</h3>
              <p className="text-sm text-slate-500">{item.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 p-3 flex items-center gap-2">
                <Clock size={16} className="text-teal-600" />
                <span className="font-semibold text-slate-800">{item.prep_time}</span>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 font-semibold text-slate-800">Yield: {item.yield}</div>
              <div className="rounded-2xl bg-slate-50 p-3 flex items-center gap-2 text-slate-800">
                <Thermometer size={16} className="text-amber-500" />
                {item.storage}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-900">Ingredients</h4>
              <div className="rounded-2xl bg-slate-50 p-4 space-y-2">
                {item.ingredients.map((ingredient, ingIndex) => (
                  <div key={ingIndex} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                    {ingredient}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-900">Preparation steps</h4>
              <div className="space-y-2">
                {item.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-sky-500 text-white text-xs font-semibold">
                      {stepIndex + 1}
                    </div>
                    <p className="text-sm text-slate-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-900">Great for</h4>
              <div className="flex flex-wrap gap-2">
                {item.uses.map((use, useIndex) => (
                  <span key={useIndex} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
                    {use}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="rounded-[32px] border border-white/70 bg-white/90 p-5 shadow space-y-2">
          <h4 className="text-lg font-semibold text-slate-900">✨ Pro tips</h4>
          <ul className="text-sm text-slate-500 space-y-1">
            <li>• Dedicate 2–3 hours on your calmest day and batch every base.</li>
            <li>• Label containers with contents plus freeze date.</li>
            <li>• Thaw overnight for sauces; microwave stock cubes straight from frozen.</li>
            <li>• Keep one tray ready-to-cook for quick weeknight meals.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
