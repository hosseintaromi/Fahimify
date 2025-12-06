"use client"

import { useState } from "react"
import { ArrowLeft, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Ingredient {
  id: string
  name: string
  quantity: string
}

interface AddRecipeFormProps {
  onBack: () => void
}

const CUISINES = ["Italian", "Persian", "Turkish", "Chinese", "Indian", "Mexican", "Thai", "French", "Original"]

export default function AddRecipeForm({ onBack }: AddRecipeFormProps) {
  const [recipeName, setRecipeName] = useState("")
  const [cuisines, setCuisines] = useState<string[]>([])
  const [prepTime, setPrepTime] = useState("")
  const [cookTime, setCookTime] = useState("")
  const [instructions, setInstructions] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: "1", name: "", quantity: "" }])

  const addIngredient = () => {
    const newId = Date.now().toString()
    setIngredients([...ingredients, { id: newId, name: "", quantity: "" }])
  }

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id))
  }

  const updateIngredient = (id: string, field: "name" | "quantity", value: string) => {
    setIngredients(ingredients.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing)))
  }

  const toggleCuisine = (cuisine: string) => {
    if (cuisines.includes(cuisine)) {
      setCuisines(cuisines.filter((c) => c !== cuisine))
    } else {
      setCuisines([...cuisines, cuisine])
    }
  }

  const handleSave = () => {
    // Validation and save logic
    console.log({
      recipeName,
      cuisines,
      prepTime,
      cookTime,
      instructions,
      ingredients,
    })
  }

  const isFormValid = recipeName && cuisines.length > 0 && ingredients.some((ing) => ing.name) && instructions

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Add New Recipe</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Recipe Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Recipe Name</label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            placeholder="e.g., Spicy Chickpea Curry"
            className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Cuisine Category */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">Cuisine Category</label>
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => toggleCuisine(cuisine)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  cuisines.includes(cuisine)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* Preparation Time */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Preparation Time (minutes)</label>
          <input
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            placeholder="e.g., 15"
            className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Cooking Time */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Cooking Time (minutes)</label>
          <input
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            placeholder="e.g., 30"
            className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Ingredients */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">Ingredients</label>
          <div className="space-y-3">
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="flex gap-2">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                  placeholder="Ingredient name"
                  className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(ingredient.id, "quantity", e.target.value)}
                  placeholder="e.g., 200g, 1 tbsp"
                  className="w-32 px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => removeIngredient(ingredient.id)}
                  disabled={ingredients.length === 1}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-destructive"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addIngredient}
            className="w-full py-3 px-4 border border-dashed border-primary rounded-lg text-primary hover:bg-primary/5 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter step-by-step cooking instructions..."
            rows={6}
            className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!isFormValid}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Recipe
        </Button>
      </div>
    </div>
  )
}
