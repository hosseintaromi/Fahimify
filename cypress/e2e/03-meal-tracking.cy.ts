describe("Multi-Meal Tracking", () => {
  const timestamp = Date.now();
  const testUser = {
    username: `tracker_${timestamp}`,
    email: `tracker_${timestamp}@test.com`,
    password: "Test123!@#",
  };

  before(() => {
    cy.visit("/");
    cy.signup(testUser.username, testUser.email, testUser.password);

    cy.fixture("preferences").then((prefs) => {
      cy.completeOnboarding(prefs.default);
    });

    cy.generatePlan();
  });

  beforeEach(() => {
    cy.login(testUser.username, testUser.password);
  });

  it("should track single meal consumption", () => {
    cy.contains("Breakfast")
      .parents('[class*="rounded"]')
      .first()
      .within(() => {
        cy.contains("button", "Mark").click();
      });

    cy.wait(2000);

    cy.getSpent().then((spent) => {
      const spentValue = parseFloat(spent.replace("€", ""));
      expect(spentValue).to.be.greaterThan(0);
      cy.wrap(spentValue).as("breakfastCost");
    });

    cy.contains("Breakfast")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");
  });

  it("should accumulate costs for multiple meals", () => {
    cy.get("@breakfastCost").then((breakfastCost) => {
      cy.contains("Lunch")
        .parents('[class*="rounded"]')
        .first()
        .within(() => {
          cy.contains("button", "Mark").click();
        });

      cy.wait(2000);

      cy.getSpent().then((spent) => {
        const spentValue = parseFloat(spent.replace("€", ""));
        expect(spentValue).to.be.greaterThan(breakfastCost as number);
        cy.wrap(spentValue).as("breakfastPlusLunchCost");
      });
    });

    cy.contains("Lunch")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");
  });

  it("should track all three daily meals", () => {
    cy.get("@breakfastPlusLunchCost").then((previousCost) => {
      cy.contains("Dinner")
        .parents('[class*="rounded"]')
        .first()
        .within(() => {
          cy.contains("button", "Mark").click();
        });

      cy.wait(2000);

      cy.getSpent().then((spent) => {
        const spentValue = parseFloat(spent.replace("€", ""));
        expect(spentValue).to.be.greaterThan(previousCost as number);
      });
    });

    cy.contains("Breakfast")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");
    cy.contains("Lunch")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");
    cy.contains("Dinner")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");
  });

  it("should show eaten meals in weekly plan", () => {
    cy.contains("button", "Plan").click();

    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });
    cy.contains(currentDay).click();
    cy.wait(500);

    cy.contains("BREAKFAST").parent().parent().should("contain", "Eaten");
    cy.contains("LUNCH").parent().parent().should("contain", "Eaten");
    cy.contains("DINNER").parent().parent().should("contain", "Eaten");
  });

  it("should update macro balance after meals", () => {
    cy.contains("button", "Home").click();

    cy.getMacroPercent("PROTEIN").then((percent) => {
      const value = parseInt(percent.replace("%", ""));
      expect(value).to.be.greaterThan(0);
    });

    cy.getMacroPercent("CALORIES").then((percent) => {
      const value = parseInt(percent.replace("%", ""));
      expect(value).to.be.greaterThan(0);
    });

    cy.getMacroPercent("FAT").then((percent) => {
      const value = parseInt(percent.replace("%", ""));
      expect(value).to.be.greaterThan(0);
    });
  });

  it("should persist eaten meals across navigation", () => {
    cy.contains("button", "Nutrition").click();
    cy.wait(500);
    cy.contains("button", "Plan").click();
    cy.wait(500);
    cy.contains("button", "Home").click();

    cy.contains("Breakfast")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");
    cy.contains("Lunch")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");
    cy.contains("Dinner")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");
  });

  it("should persist eaten meals after page refresh", () => {
    cy.reload();
    cy.wait(1000);

    cy.contains("Breakfast")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");
    cy.contains("Lunch")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");
    cy.contains("Dinner")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");

    cy.getSpent().then((spent) => {
      const spentValue = parseFloat(spent.replace("€", ""));
      expect(spentValue).to.be.greaterThan(0);
    });
  });
});
