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
  
  const priceCategory = idx % 3;
  const price = priceCategory === 0 
    ? 3.5 + (idx % 4) * 0.5
    : priceCategory === 1 
    ? 5.0 + (idx % 5) * 0.6
    : 7.0 + (idx % 4) * 0.8;
  
  const cook = 15 + (idx % 6) * 5;
  const cal = 350 + (idx % 8) * 40;
  const protein = 18 + (idx % 7) * 3;
  const fat = 10 + (idx % 6) * 2;
  const carbs = 45 + (idx % 9) * 5;
  const iron = 3.5 + (idx % 7) * 0.5;
  const magnesium = 85 + (idx % 8) * 8;
  const potassium = 650 + (idx % 10) * 20;
  const quantityChickpea = 120 + (idx % 6) * 20;
  const quantityRice = 130 + (idx % 8) * 15;
  
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
