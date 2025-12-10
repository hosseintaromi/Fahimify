describe("Complete User Journey", () => {
  const timestamp = Date.now();
  const testUser = {
    username: `testuser_${timestamp}`,
    email: `test_${timestamp}@test.com`,
    password: "Test123!@#",
  };

  it("should complete full user journey from signup to meal tracking", () => {
    cy.visit("/");

    cy.signup(testUser.username, testUser.email, testUser.password);

    cy.fixture("preferences").then((prefs) => {
      cy.completeOnboarding(prefs.default);
    });

    cy.getBudgetRemaining().should("contain", "€100");
    cy.getSpent().should("contain", "€0");

    cy.contains("No plan yet").should("be.visible");

    cy.generatePlan();

    cy.contains("Breakfast").should("be.visible");
    cy.contains("Lunch").should("be.visible");
    cy.contains("Dinner").should("be.visible");

    cy.contains("Estimated weekly cost").should("be.visible");
    cy.contains("Estimated weekly cost")
      .parent()
      .find("span")
      .invoke("text")
      .then((cost) => {
        const costValue = parseFloat(cost.replace("€", ""));
        expect(costValue).to.be.lessThan(100);
      });

    cy.contains("Dinner").parents('[class*="rounded"]').first().click();

    cy.url().should("include", "/recipe/");
    cy.contains("Mark as eaten").should("be.visible");

    cy.intercept("POST", "/api/meal-log").as("logMeal");
    cy.contains("button", "Mark as eaten").click();
    cy.wait("@logMeal");

    cy.contains("Logged").should("be.visible");
    cy.contains("Go Back").click();

    cy.url().should("include", "/dashboard");

    cy.getSpent().then((spent) => {
      const spentValue = parseFloat(spent.replace("€", ""));
      expect(spentValue).to.be.greaterThan(0);
    });

    cy.contains("Dinner")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");

    cy.getMacroPercent("PROTEIN").then((percent) => {
      const value = parseInt(percent.replace("%", ""));
      expect(value).to.be.greaterThan(0);
    });

    cy.contains("button", "Nutrition").click();
    cy.url().should("include", "tab=nutrition");

    cy.contains("Nutrition Tracking").should("be.visible");

    cy.contains("button", "Plan").click();
    cy.url().should("include", "tab=plan");

    cy.contains("Weekly Plan").should("be.visible");

    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });

    cy.contains(currentDay).should("be.visible");
    cy.contains(currentDay).click();
    cy.wait(500);

    cy.contains("BREAKFAST").should("be.visible");
    cy.contains("BREAKFAST")
      .parent()
      .parent()
      .within(() => {
        cy.contains("Cost:")
          .invoke("text")
          .then((costText) => {
            const originalCost = costText.match(/€(\d+\.\d+)/)?.[1];
            if (originalCost) {
              cy.wrap(originalCost).as("originalBreakfastCost");
            }
          });
      });

    cy.contains("BREAKFAST")
      .parent()
      .parent()
      .within(() => {
        cy.contains("button", "Swap meal").click();
      });

    cy.wait(300);
    cy.contains("Find Cheaper Meal").should("be.visible");
    cy.intercept("POST", "/api/plan/swap").as("swapMeal");
    cy.contains("button", "Find Cheaper Meal").click();
    cy.wait("@swapMeal");

    cy.wait(1000);

    cy.contains("BREAKFAST").should("be.visible");

    cy.contains("LUNCH").should("be.visible");
    cy.contains("DINNER").should("be.visible");
  });

  it("should handle navigation back to dashboard", () => {
    cy.login(testUser.username, testUser.password);

    cy.url().should("include", "/dashboard");
    cy.contains("Your meals").should("be.visible");
  });
});
