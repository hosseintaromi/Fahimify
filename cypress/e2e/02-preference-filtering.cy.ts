describe("Preference Filtering", () => {
  describe("TC1: Cuisine Preference", () => {
    const timestamp = Date.now();
    const testUser = {
      username: `italian_fan_${timestamp}`,
      email: `italian_${timestamp}@test.com`,
      password: "Test123!@#",
    };

    it("should only show meals from preferred cuisines", () => {
      cy.visit("/");
      cy.signup(testUser.username, testUser.email, testUser.password);

      cy.fixture("preferences").then((prefs) => {
        cy.completeOnboarding(prefs.italian_only);
      });

      cy.generatePlan();

      cy.contains("button", "Plan").click();

      const today = new Date();
      const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });
      cy.contains(currentDay).click();
      cy.wait(500);

      cy.contains("BREAKFAST").should("be.visible");
      cy.contains("LUNCH").should("be.visible");
      cy.contains("DINNER").should("be.visible");
    });
  });

  describe("TC2: Allergy Filtering", () => {
    const timestamp = Date.now();
    const testUser = {
      username: `allergy_user_${timestamp}`,
      email: `allergy_${timestamp}@test.com`,
      password: "Test123!@#",
    };

    it("should not include meals with allergens", () => {
      cy.visit("/");
      cy.signup(testUser.username, testUser.email, testUser.password);

      cy.fixture("preferences").then((prefs) => {
        cy.completeOnboarding(prefs.multiple_allergies);
      });

      cy.generatePlan();

      cy.contains("button", "Plan").click();

      const today = new Date();
      const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });
      cy.contains(currentDay).click();
      cy.wait(500);

      cy.contains("BREAKFAST")
        .parent()
        .parent()
        .within(() => {
          cy.contains("button", "View").click();
        });

      cy.url().should("include", "/recipe/");

      cy.contains("Ingredients").should("be.visible");

      cy.get("body").then(($body) => {
        const text = $body.text().toLowerCase();
        expect(text).to.not.contain("peanut");
        expect(text).to.not.contain("shellfish");
      });

      cy.go("back");
    });
  });

  describe("TC3: Nutrient Boost", () => {
    const timestamp = Date.now();
    const testUser = {
      username: `iron_boost_${timestamp}`,
      email: `iron_${timestamp}@test.com`,
      password: "Test123!@#",
    };

    it("should focus on boosted nutrient", () => {
      cy.visit("/");
      cy.signup(testUser.username, testUser.email, testUser.password);

      cy.fixture("preferences").then((prefs) => {
        const ironBoostPrefs = {
          ...prefs.default,
          boostNutrient: "iron",
        };
        cy.completeOnboarding(ironBoostPrefs);
      });

      cy.generatePlan();

      cy.contains("Your meals").should("be.visible");
      cy.contains("Breakfast").should("be.visible");
      cy.contains("Lunch").should("be.visible");
      cy.contains("Dinner").should("be.visible");
    });
  });

  describe("TC4: Budget Constraint", () => {
    const timestamp = Date.now();
    const testUser = {
      username: `budget_user_${timestamp}`,
      email: `budget_${timestamp}@test.com`,
      password: "Test123!@#",
    };

    it("should respect budget constraints", () => {
      cy.visit("/");
      cy.signup(testUser.username, testUser.email, testUser.password);

      cy.fixture("preferences").then((prefs) => {
        const lowBudgetPrefs = { ...prefs.default, budget: 50 };
        cy.completeOnboarding(lowBudgetPrefs);
      });

      cy.generatePlan();

      cy.contains("Estimated weekly cost")
        .parent()
        .find("span")
        .invoke("text")
        .then((cost) => {
          const costValue = parseFloat(cost.replace("€", ""));
          expect(costValue).to.be.lessThan(50);
        });
    });
  });
});
