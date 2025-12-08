export const sampleIngredients = [
  {
    id: "ing-chickpea",
    name: "Chickpeas",
    allergenTags: [],
    nutritionalData: {
      calories: 164,
      protein: 8.9,
      fat: 2.6,
      carbs: 27.4,
      iron: 2.9,
      magnesium: 48,
      potassium: 291,
    },
  },
  {
    id: "ing-rice",
    name: "Rice",
    allergenTags: [],
    nutritionalData: {
      calories: 130,
      protein: 2.7,
      fat: 0.3,
      carbs: 28,
      iron: 1.2,
      magnesium: 12,
      potassium: 35,
    },
  },
];

const baseRecipes = [
  {
    id: "rec-curry",
    title: "Spicy Chickpea Curry",
    instructions:
      "Heat oil, sauté aromatics, add tomato, spices, chickpeas, simmer with coconut milk.",
    cookTime: 40,
    cuisineCategory: "Indian",
    sourceType: "SYSTEM",

    imageUrl:
      "https://images.unsplash.com/photo-1604908812115-9f85de5d7791?auto=format&fit=crop&w=800&q=80",
    pricePerServing: 6.5,
    nutrients: {
      calories: 520,
      protein: 18,
      fat: 16,
      carbs: 70,
      iron: 6.5,
      magnesium: 110,
      potassium: 850,
    },
    ingredients: [
      { ingredientId: "ing-chickpea", quantityGrams: 240 },
      { ingredientId: "ing-rice", quantityGrams: 180 },
    ],
  },
  {
    id: "rec-bowl",
    title: "Protein Power Bowl",
    instructions:
      "Cook rice, roast chickpeas, assemble with greens and dressing.",
    cookTime: 25,
    cuisineCategory: "Mediterranean",
    sourceType: "SYSTEM",
    imageUrl:
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80",
    pricePerServing: 7.2,
    nutrients: {
      calories: 480,
      protein: 22,
      fat: 12,
      carbs: 62,
      iron: 5.1,
      magnesium: 105,
      potassium: 780,
    },
    ingredients: [
      { ingredientId: "ing-chickpea", quantityGrams: 200 },
      { ingredientId: "ing-rice", quantityGrams: 150 },
    ],
  },
];

const generatedRecipes = Array.from({ length: 98 }, (_, idx) => {
  const cuisines = [
    "Mediterranean",
    "Italian",
    "Mexican",
    "Thai",
    "French",
    "Turkish",
    "Korean",
    "Japanese",
    "Greek",
    "Spanish",
  ];
  const mains = [
    "Citrus Herb Chicken",
    "Garlic Butter Shrimp",
    "Creamy Pesto Pasta",
    "Chipotle Beef Bowl",
    "Sesame Ginger Tofu",
    "Roasted Veggie Quinoa",
    "Lemon Dill Salmon",
    "Smoky Chickpea Stew",
    "Honey Mustard Chicken",
    "Spicy Beef Tacos",
    "Teriyaki Salmon Rice Bowl",
    "Mushroom Spinach Risotto",
    "Harissa Chicken with Couscous",
    "Miso Glazed Eggplant",
    "Cajun Shrimp Orzo",
    "Zesty Turkey Meatballs",
    "Mediterranean Lamb Pilaf",
    "Tomato Basil Gnocchi",
    "Korean BBQ Chicken",
    "Thai Peanut Noodles",
  ];
  const title = `${mains[idx % mains.length]} (${
    cuisines[idx % cuisines.length]
  })`;
  const price = 7 + (idx % 6) * 0.7;
  const cook = 18 + (idx % 5) * 5;
  const cal = 440 + (idx % 7) * 35;
  const protein = 22 + (idx % 6) * 3;
  const fat = 12 + (idx % 5) * 1.6;
  const carbs = 54 + (idx % 8) * 6;
  const iron = 4.4 + (idx % 6) * 0.45;
  const magnesium = 98 + (idx % 7) * 7;
  const potassium = 720 + (idx % 9) * 18;
  const quantityChickpea = 150 + (idx % 5) * 25;
  const quantityRice = 150 + (idx % 7) * 18;
  return {
    id: `rec-auto-${(idx + 3).toString().padStart(3, "0")}`,
    title,
    instructions:
      "Cook base, saute protein with spices, combine and serve hot.",
    cookTime: cook,
    cuisineCategory: cuisines[idx % cuisines.length],
    sourceType: "SYSTEM",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    pricePerServing: Number(price.toFixed(2)),
    nutrients: {
      calories: cal,
      protein,
      fat: Number(fat.toFixed(1)),
      carbs,
      iron: Number(iron.toFixed(1)),
      magnesium,
      potassium,
    },
    ingredients: [
      { ingredientId: "ing-chickpea", quantityGrams: quantityChickpea },
      { ingredientId: "ing-rice", quantityGrams: quantityRice },
    ],
  };
});

export const sampleRecipes = [...baseRecipes, ...generatedRecipes];

export const samplePrices = [
  {
    id: "price-1",
    ingredientId: "ing-chickpea",
    storeName: "Lidl",
    region: "Berlin",
    pricePerUnit: 0.89,
    unitSize: 400,
    unitType: "g",
  },
  {
    id: "price-2",
    ingredientId: "ing-rice",
    storeName: "Aldi",
    region: "Berlin",
    pricePerUnit: 1.19,
    unitSize: 1000,
    unitType: "g",
  },
];
