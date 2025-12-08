"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { AUTH_STORAGE_KEY, readClientFlag } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Snapshot = {
    users: any[]
    plans: any[]
    recipes: any[]
    ingredients: any[]
    prices: any[]
}

type IngredientRow = {
    ingredientId: string
    quantityGrams: string
}

type NutrientInput = {
    calories: string
    protein: string
    fat: string
    carbs: string
    iron: string
    magnesium: string
    potassium: string
}

export default function AdminPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<Snapshot | null>(null)
    const [title, setTitle] = useState("")
    const [cuisineCategory, setCuisineCategory] = useState("")
    const [cookTime, setCookTime] = useState("")
    const [instructions, setInstructions] = useState("")
    const [pricePerServing, setPricePerServing] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [nutrients, setNutrients] = useState<NutrientInput>({
        calories: "",
        protein: "",
        fat: "",
        carbs: "",
        iron: "",
        magnesium: "",
        potassium: "",
    })
    const [ingredientsInput, setIngredientsInput] = useState<IngredientRow[]>([{ ingredientId: "", quantityGrams: "" }])
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        const auth = readClientFlag(AUTH_STORAGE_KEY) === "true"
        if (!auth) {
            router.replace("/login")
            return
        }
        const load = async () => {
            const res = await fetch("/api/admin/snapshot")
            const json = (await res.json()) as Snapshot
            setData(json)
            setLoading(false)
        }
        load()
    }, [router])

    useEffect(() => {
        if (data?.ingredients?.length && ingredientsInput[0]?.ingredientId === "") {
            setIngredientsInput([{ ingredientId: data.ingredients[0].id, quantityGrams: "" }])
        }
    }, [data, ingredientsInput])

    const canSubmit = useMemo(() => {
        const hasNutrients = Object.values(nutrients).some((value) => value.trim() !== "")
        return (
            title.trim() &&
            cuisineCategory.trim() &&
            instructions.trim() &&
            cookTime.trim() &&
            pricePerServing.trim() &&
            hasNutrients
        )
    }, [title, cuisineCategory, instructions, cookTime, pricePerServing, nutrients])

    const updateIngredientRow = (index: number, field: keyof IngredientRow, value: string) => {
        setIngredientsInput((prev) => prev.map((row, idx) => (idx === index ? { ...row, [field]: value } : row)))
    }

    const addIngredientRow = () => {
        const fallbackId = data?.ingredients?.[0]?.id ?? ""
        setIngredientsInput((prev) => [...prev, { ingredientId: fallbackId, quantityGrams: "" }])
    }

    const removeIngredientRow = (index: number) => {
        setIngredientsInput((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== index)))
    }

    const resetForm = () => {
        setTitle("")
        setCuisineCategory("")
        setCookTime("")
        setInstructions("")
        setPricePerServing("")
        setImageUrl("")
        setNutrients({
            calories: "",
            protein: "",
            fat: "",
            carbs: "",
            iron: "",
            magnesium: "",
            potassium: "",
        })
        setIngredientsInput([{ ingredientId: data?.ingredients?.[0]?.id ?? "", quantityGrams: "" }])
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (submitting || !canSubmit) return
        setSubmitting(true)
        setError(null)
        setSuccess(null)
        const nutrientPayload = Object.fromEntries(
            Object.entries(nutrients)
                .filter(([, value]) => value.trim() !== "")
                .map(([key, value]) => [key, Number(value)]),
        )
        const ingredientPayload = ingredientsInput
            .filter((row) => row.ingredientId && row.quantityGrams)
            .map((row) => ({ ingredientId: row.ingredientId, quantityGrams: Number(row.quantityGrams) }))
        const payload = {
            title,
            instructions,
            cookTime: Number(cookTime),
            cuisineCategory,
            sourceType: "USER",
            imageUrl: imageUrl || undefined,
            pricePerServing: Number(pricePerServing),
            nutrients: nutrientPayload,
            ingredients: ingredientPayload.length ? ingredientPayload : undefined,
        }
        const res = await fetch("/api/admin/recipes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        if (!res.ok) {
            const body = await res.json().catch(() => ({}))
            setError(body?.message ?? "Failed to save recipe")
            setSubmitting(false)
            return
        }
        const recipe = await res.json()
        setData((prev) => (prev ? { ...prev, recipes: [...prev.recipes, recipe] } : prev))
        setSuccess("Recipe added")
        resetForm()
        setSubmitting(false)
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-muted-foreground">Loading admin...</div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Admin Console</h1>
                <Button onClick={() => router.push("/")}>Go to app</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-3xl font-semibold">{data?.users.length ?? 0}</div>
                        <div className="text-sm text-muted-foreground">Profiles stored in memory</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Plans</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-3xl font-semibold">{data?.plans.length ?? 0}</div>
                        <div className="text-sm text-muted-foreground">Generated plans</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recipes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-3xl font-semibold">{data?.recipes.length ?? 0}</div>
                        <div className="text-sm text-muted-foreground">Available recipes</div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Ingredients</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {(data?.ingredients ?? []).map((ing) => (
                            <div key={ing.id} className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <div className="font-medium">{ing.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {Object.keys(ing.nutritionalData || {}).slice(0, 3).join(", ")}
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground">{(ing.allergenTags || []).join(", ")}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Prices</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {(data?.prices ?? []).map((price) => (
                            <div key={price.id} className="flex items-center justify-between rounded-lg border p-3">
                                <div className="font-medium">{price.storeName}</div>
                                <div className="text-sm text-muted-foreground">
                                    {price.ingredientId} · €{price.pricePerUnit} / {price.unitSize}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Add Recipe</CardTitle>
                        <div className="text-sm text-muted-foreground">{success ? success : error}</div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cuisine">Cuisine</Label>
                                <Input
                                    id="cuisine"
                                    value={cuisineCategory}
                                    onChange={(event) => setCuisineCategory(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cook">Cook time (min)</Label>
                                <Input
                                    id="cook"
                                    type="number"
                                    min="0"
                                    value={cookTime}
                                    onChange={(event) => setCookTime(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price per serving (€)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={pricePerServing}
                                    onChange={(event) => setPricePerServing(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Image URL</Label>
                                <Input id="image" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="instructions">Instructions</Label>
                                <Textarea
                                    id="instructions"
                                    rows={3}
                                    value={instructions}
                                    onChange={(event) => setInstructions(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 grid gap-3">
                                <div className="grid gap-3 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="calories">Calories</Label>
                                        <Input
                                            id="calories"
                                            type="number"
                                            min="0"
                                            value={nutrients.calories}
                                            onChange={(event) => setNutrients({ ...nutrients, calories: event.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="protein">Protein (g)</Label>
                                        <Input
                                            id="protein"
                                            type="number"
                                            min="0"
                                            value={nutrients.protein}
                                            onChange={(event) => setNutrients({ ...nutrients, protein: event.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fat">Fat (g)</Label>
                                        <Input
                                            id="fat"
                                            type="number"
                                            min="0"
                                            value={nutrients.fat}
                                            onChange={(event) => setNutrients({ ...nutrients, fat: event.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="carbs">Carbs (g)</Label>
                                        <Input
                                            id="carbs"
                                            type="number"
                                            min="0"
                                            value={nutrients.carbs}
                                            onChange={(event) => setNutrients({ ...nutrients, carbs: event.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="iron">Iron (mg)</Label>
                                        <Input
                                            id="iron"
                                            type="number"
                                            min="0"
                                            value={nutrients.iron}
                                            onChange={(event) => setNutrients({ ...nutrients, iron: event.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="magnesium">Magnesium (mg)</Label>
                                        <Input
                                            id="magnesium"
                                            type="number"
                                            min="0"
                                            value={nutrients.magnesium}
                                            onChange={(event) => setNutrients({ ...nutrients, magnesium: event.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="potassium">Potassium (mg)</Label>
                                        <Input
                                            id="potassium"
                                            type="number"
                                            min="0"
                                            value={nutrients.potassium}
                                            onChange={(event) => setNutrients({ ...nutrients, potassium: event.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">Ingredients</div>
                                    <Button type="button" variant="outline" size="sm" onClick={addIngredientRow}>
                                        Add ingredient
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {ingredientsInput.map((row, index) => (
                                        <div key={`${row.ingredientId}-${index}`} className="grid gap-3 md:grid-cols-12">
                                            <div className="md:col-span-6">
                                                <Label>Ingredient</Label>
                                                <select
                                                    value={row.ingredientId}
                                                    onChange={(event) => updateIngredientRow(index, "ingredientId", event.target.value)}
                                                    className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                                >
                                                    {(data?.ingredients ?? []).map((ing) => (
                                                        <option key={ing.id} value={ing.id}>
                                                            {ing.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="md:col-span-5">
                                                <Label>Quantity (g)</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.quantityGrams}
                                                    onChange={(event) => updateIngredientRow(index, "quantityGrams", event.target.value)}
                                                />
                                            </div>
                                            <div className="md:col-span-1 flex items-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    disabled={ingredientsInput.length === 1}
                                                    onClick={() => removeIngredientRow(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-2 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Recipes are stored in memory for this session.
                                </div>
                                <Button type="submit" disabled={!canSubmit || submitting}>
                                    {submitting ? "Saving..." : "Save recipe"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recipes in store</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {(data?.recipes ?? []).slice().reverse().map((recipe) => (
                            <div key={recipe.id} className="rounded-lg border p-3 space-y-1">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">{recipe.title}</div>
                                    <div className="text-xs text-muted-foreground">{recipe.cuisineCategory}</div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {recipe.cookTime} min • €{recipe.pricePerServing}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}

