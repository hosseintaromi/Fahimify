"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Euro, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecipeInput } from "@/lib/fahimeh";

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "ingredients" | "instructions" | "nutrition"
  >("ingredients");
  const [eaten, setEaten] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await fetch(`/api/recipe/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setRecipe(data);
      }
      setLoading(false);
    };
    fetchRecipe();
  }, [params.id]);

  useEffect(() => {
    const checkIfEaten = async () => {
      try {
        const res = await fetch("/api/meal-log", {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        if (res.ok) {
          const data = await res.json();
          const logs = data.logs || [];
          const alreadyLogged = logs.some((log: { recipeId: string }) => log.recipeId === params.id);
          setEaten(alreadyLogged);
        }
      } catch (err) {
        console.error("Failed to check meal log:", err);
      }
    };
    if (params.id) {
      checkIfEaten();
    }
  }, [params.id]);

  const handleMarkAsEaten = async () => {
    if (!recipe) return;
    await fetch("/api/meal-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        cost: recipe.pricePerServing,
        nutrients: recipe.nutrients || {},
      }),
    });
    setEaten(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#dff7ef] via-white to-white">
        Loading...
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#dff7ef] via-white to-white">
        Recipe not found
      </div>
    );
  }

  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : recipe.instructions.split("\n").filter((s) => s.trim());

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff7ef] via-white to-white pb-16">
      <div className="relative h-72 w-full overflow-hidden rounded-b-[40px] shadow-lg">
        <img
          src={recipe.imageUrl || "/spicy-chickpea-curry-dish-food-photography.jpg"}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
        >
          <ArrowLeft size={24} className="text-slate-700" />
        </button>
        <div className="absolute bottom-6 left-6 space-y-3 text-white">
          <h1 className="text-3xl font-semibold">{recipe.title}</h1>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-white/90 px-3 py-1 text-slate-700">
              Cuisine: {recipe.cuisineCategory}
            </span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-emerald-600">
              {recipe.sourceType}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-3xl space-y-6 px-4">
        <div className="flex flex-wrap gap-4 rounded-[32px] bg-white/80 px-6 py-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock size={18} className="text-teal-500" />
            <span>Cook Time: {recipe.cookTime} min</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Euro size={18} className="text-teal-500" />
            <span>Estimated Cost: €{recipe.pricePerServing.toFixed(2)}</span>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/90 p-2 shadow-sm">
          <div className="flex gap-2 rounded-[28px] bg-slate-100 p-1 text-sm font-semibold text-slate-500">
            {(["ingredients", "instructions", "nutrition"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-[24px] px-4 py-2 transition ${activeTab === tab
                    ? "bg-white text-teal-600 shadow"
                    : "hover:text-teal-500"
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>
          <div className="p-6">
            {activeTab === "ingredients" && (
              <div className="space-y-3">
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ing, index) => (
                    <div
                      key={`${ing.ingredientId}-${index}`}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-slate-300 text-teal-500"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {ing.ingredientId}
                          </p>
                          <p className="text-xs text-slate-500">
                            {ing.quantityGrams}g
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    No detailed ingredients available
                  </div>
                )}
              </div>
            )}

            {activeTab === "instructions" && (
              <div className="space-y-4">
                {instructions.map((step, index) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-2xl border border-slate-100 p-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-teal-500 to-sky-500 text-sm font-semibold text-white flex-shrink-0">
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
                  <StatCard
                    label="Carbs"
                    value={`${(recipe.nutrients.carbs || 0).toFixed(1)}g`}
                    color="text-teal-600"
                  />
                  <StatCard
                    label="Protein"
                    value={`${(recipe.nutrients.protein || 0).toFixed(1)}g`}
                    color="text-indigo-600"
                  />
                  <StatCard
                    label="Fat"
                    value={`${(recipe.nutrients.fat || 0).toFixed(1)}g`}
                    color="text-emerald-600"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-800">
                    Other Nutrients
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {Object.entries(recipe.nutrients)
                      .filter(
                        ([key]) =>
                          !["carbs", "protein", "fat"].includes(key)
                      )
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm"
                        >
                          <span className="capitalize text-slate-700">
                            {key}
                          </span>
                          <span className="text-slate-500">
                            {typeof value === "number"
                              ? value.toFixed(1)
                              : value}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-sm">
          {!eaten ? (
            <Button
              onClick={handleMarkAsEaten}
              className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:from-teal-600 hover:to-blue-600"
            >
              Mark as eaten
            </Button>
          ) : (
            <Button
              disabled
              className="w-full rounded-2xl bg-emerald-100 text-emerald-700 font-semibold"
            >
              <Check size={18} className="mr-2" />
              Logged
            </Button>
          )}
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
