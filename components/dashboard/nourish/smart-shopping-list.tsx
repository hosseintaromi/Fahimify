"use client"

import { ArrowLeft, MapPin, DollarSign } from "lucide-react"

interface SmartShoppingListProps {
  onBack: () => void
}

export default function SmartShoppingList({ onBack }: SmartShoppingListProps) {
  const shoppingItems = [
    {
      ingredient: "Chickpeas (dried)",
      quantity: "500g",
      stores: [
        { name: "Local Market", price: "€2.50", distance: "0.5 km" },
        { name: "Supermarket A", price: "€3.20", distance: "1.2 km" },
      ],
    },
    {
      ingredient: "Tomatoes (canned)",
      quantity: "2 x 400g",
      stores: [
        { name: "Supermarket A", price: "€1.80", distance: "1.2 km" },
        { name: "Local Market", price: "€2.10", distance: "0.5 km" },
      ],
    },
    {
      ingredient: "Coconut Milk",
      quantity: "400ml",
      stores: [
        { name: "Ethnic Store", price: "€1.50", distance: "2.3 km" },
        { name: "Supermarket A", price: "€2.30", distance: "1.2 km" },
      ],
    },
    {
      ingredient: "Basmati Rice",
      quantity: "1kg",
      stores: [
        { name: "Local Market", price: "€3.50", distance: "0.5 km" },
        { name: "Ethnic Store", price: "€3.20", distance: "2.3 km" },
      ],
    },
    {
      ingredient: "Onions",
      quantity: "1kg",
      stores: [
        { name: "Local Market", price: "€1.20", distance: "0.5 km" },
        { name: "Supermarket A", price: "€1.80", distance: "1.2 km" },
      ],
    },
    {
      ingredient: "Garlic",
      quantity: "200g",
      stores: [
        { name: "Local Market", price: "€0.80", distance: "0.5 km" },
        { name: "Supermarket A", price: "€1.50", distance: "1.2 km" },
      ],
    },
  ]

  const totalEstimatedCost = "€18.45"

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dff7ef] via-[#e7f5ff] to-white pb-12">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-8">
        <button onClick={onBack} className="rounded-2xl bg-white/80 p-2 shadow">
          <ArrowLeft size={24} className="text-slate-700" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Labs</p>
          <h1 className="text-3xl font-semibold text-slate-900">Smart Shopping List</h1>
          <p className="text-sm text-slate-500">Curated for your planned meals.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-5">
        <div className="rounded-[32px] border border-white/70 bg-gradient-to-r from-amber-50 to-emerald-50 p-6 shadow-lg">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-500">Estimated total cost</p>
          <p className="text-3xl font-semibold text-slate-900 mt-2">{totalEstimatedCost}</p>
          <p className="text-sm text-slate-500">Includes best store picks for each ingredient.</p>
        </div>

        <div className="space-y-4">
          {shoppingItems.map((item, index) => (
            <div key={index} className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-slate-400">Ingredient</p>
                  <h3 className="text-xl font-semibold text-slate-900">{item.ingredient}</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {item.quantity}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {item.stores.map((store, storeIndex) => (
                  <div
                    key={storeIndex}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                      storeIndex === 0
                        ? "border-teal-200 bg-gradient-to-r from-teal-50 to-sky-50"
                        : "border-slate-100 bg-white"
                    }`}
                  >
                    <div>
                      <p className={`font-semibold ${storeIndex === 0 ? "text-teal-700" : "text-slate-800"}`}>{store.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin size={14} />
                        {store.distance}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 text-sm font-semibold">
                      <DollarSign size={16} className={storeIndex === 0 ? "text-teal-600" : "text-slate-400"} />
                      {store.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow">
          <h4 className="text-lg font-semibold text-slate-900">Shopping tips</h4>
          <ul className="mt-3 space-y-1 text-sm text-slate-500">
            <li>• Start at Local Market for fresh produce savings.</li>
            <li>• Ethnic stores carry specialty items with better margins.</li>
            <li>• Bulk-buy pantry staples once a month.</li>
            <li>• Track loyalty promos at Supermarket A for price drops.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
