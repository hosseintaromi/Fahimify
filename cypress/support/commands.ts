/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      signup(
        username: string,
        email: string,
        password: string
      ): Chainable<void>;
      login(identifier: string, password: string): Chainable<void>;
      completeOnboarding(preferences: any): Chainable<void>;
      generatePlan(): Chainable<void>;
      markMealEaten(mealSelector: string): Chainable<void>;
      swapMeal(strategy: "cheaper" | "faster" | "nutrient"): Chainable<void>;
      getBudgetRemaining(): Chainable<string>;
      getSpent(): Chainable<string>;
      getMacroPercent(macro: string): Chainable<string>;
    }
  }
}

Cypress.Commands.add(
  "signup",
  (username: string, email: string, password: string) => {
    cy.visit("/signup");
    cy.wait(1000);
    cy.get('input[name="username"]').clear().type(username);
    cy.get('input[name="email"]').clear().type(email);
    cy.get('input[name="password"]').clear().type(password);
    cy.get('button[type="submit"]').click();
    cy.wait(4000);
  }
);

Cypress.Commands.add("login", (identifier: string, password: string) => {
  const username = identifier.includes("@")
    ? identifier.split("@")[0]
    : identifier;
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit("/login");
  cy.get('input[id="login-username"]', { timeout: 15000 }).should("be.visible");
  cy.get('input[id="login-username"]').clear().type(username);
  cy.get('input[id="login-password"]').clear().type(password);
  cy.get('button[type="submit"]').click();
  cy.wait(3000);
  cy.url().should("not.include", "/login", { timeout: 10000 });
});

Cypress.Commands.add("completeOnboarding", (preferences: any) => {
  cy.contains("button", "Next", { timeout: 10000 }).should("be.visible");

  cy.contains("button", "Next").click();
  cy.wait(1000);

  cy.contains("button", "Next").click();
  cy.wait(1000);

  cy.contains("button", "Next").click();
  cy.wait(1000);

  cy.contains("button", "Next").click();
  cy.wait(1000);

  cy.contains("button", "Next").click();
  cy.wait(1000);

  cy.contains("button", "Next").click();
  cy.wait(1000);

  cy.contains("button", "Finish setup").click();
  cy.wait(5000);

  const payload = {
    budget: preferences?.budget ?? 150,
    allergies: preferences?.allergies ?? [],
    dislikes: preferences?.dislikes ?? [],
    cookingTime: preferences?.cookingTime ?? 30,
    mealsPerDay: preferences?.mealsPerDay ?? 3,
    snacksPerDay: preferences?.snacksPerDay ?? 0,
    dietType: preferences?.dietType ?? "Omnivore",
    cuisines: preferences?.cuisines ?? [],
    boostNutrient: Boolean(preferences?.boostNutrient),
    priorityNutrient: preferences?.boostNutrient ?? null,
  };

  cy.request("POST", "/api/onboarding", payload);
  cy.wait(500);
  cy.request("/api/profile")
    .its("body.preferences.budget")
    .should("eq", payload.budget);
});

Cypress.Commands.add("generatePlan", () => {
  cy.get("body").then(($body) => {
    if ($body.text().includes("Generate weekly plan")) {
      cy.intercept("POST", "/api/plan").as("generatePlan");
      cy.contains("button", "Generate weekly plan").click();
      cy.wait("@generatePlan", { timeout: 15000 });
      cy.wait(2000);
    } else {
      cy.log("Plan already exists, skipping generation");
      cy.wait(2000);
    }
  });
  cy.contains("Breakfast", { timeout: 20000 }).should("be.visible");
});

Cypress.Commands.add("markMealEaten", (mealSelector: string) => {
  cy.intercept("POST", "/api/meal-log").as("logMeal");
  cy.get(mealSelector).within(() => {
    cy.contains("button", "Mark").click();
  });
  cy.wait("@logMeal", { timeout: 10000 });
  cy.wait(500);
});

Cypress.Commands.add(
  "swapMeal",
  (strategy: "cheaper" | "faster" | "nutrient") => {
    cy.intercept("POST", "/api/plan/swap").as("swapMeal");

    cy.contains("button", "Swap").click();
    cy.wait(300);

    const buttonText = {
      cheaper: "Find Cheaper Meal",
      faster: "Find Faster Meal",
      nutrient: "Optimize Nutrients",
    };

    cy.contains("button", buttonText[strategy]).click();
    cy.wait("@swapMeal", { timeout: 10000 });
    cy.wait(500);
  }
);

Cypress.Commands.add("getBudgetRemaining", () => {
  return cy
    .contains("Budget remaining")
    .parent()
    .find("p")
    .eq(0)
    .invoke("text");
});

Cypress.Commands.add("getSpent", () => {
  return cy.contains("Spent this week").parent().find("p").eq(0).invoke("text");
});

Cypress.Commands.add("getMacroPercent", (macro: string) => {
  return cy
    .contains(macro.toUpperCase())
    .parent()
    .find("p")
    .eq(0)
    .invoke("text");
});

export {};
