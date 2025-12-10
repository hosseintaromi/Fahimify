describe("Quick Functionality Test", () => {
  let testUser: { username: string; email: string; password: string };

  before(() => {
    const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    testUser = {
      username: `quicktest_${uniqueId}`,
      email: `quicktest_${uniqueId}@test.com`,
      password: "Test123!@#",
    };

    cy.signup(testUser.username, testUser.email, testUser.password);

    cy.fixture("preferences").then((prefs) => {
      cy.completeOnboarding(prefs.default);
    });

    cy.generatePlan();
  });

  beforeEach(() => {
    cy.login(testUser.username, testUser.password);
  });

  it("should display dashboard with budget and spending", () => {
    cy.contains("Budget remaining").should("be.visible");
    cy.contains("Spent this week").should("be.visible");
    cy.contains("Your meals").should("be.visible");
  });

  it("should display macro balance", () => {
    cy.contains("Macro balance").should("be.visible");

    cy.contains("FAT").should("be.visible");
    cy.contains("CALORIES").should("be.visible");
    cy.contains("PROTEIN").should("be.visible");
  });

  it("should have meal plan with today's meals", () => {
    cy.contains("Breakfast").should("be.visible");
    cy.contains("Lunch").should("be.visible");
    cy.contains("Dinner").should("be.visible");
  });

  it("should mark a meal as eaten", () => {
    let initialSpent: number;

    cy.contains("Spent this week")
      .parent()
      .find("p")
      .first()
      .invoke("text")
      .then((text) => {
        initialSpent = parseFloat(text.replace("€", ""));
      });

    cy.contains("Breakfast")
      .parents('[class*="rounded"]')
      .first()
      .within(() => {
        cy.contains("button", "Mark").click();
      });

    cy.wait(2000);

    cy.contains("Spent this week")
      .parent()
      .find("p")
      .first()
      .invoke("text")
      .then((text) => {
        const newSpent = parseFloat(text.replace("€", ""));
        expect(newSpent).to.be.greaterThan(initialSpent);
      });

    cy.contains("Breakfast")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");
  });

  it("should navigate to recipe detail page", () => {
    cy.contains("Dinner").parents('[class*="rounded"]').first().click();

    cy.url().should("include", "/recipe/");
    cy.contains("Ingredients").should("be.visible");
    cy.contains("Instructions").should("be.visible");
    cy.contains("Nutrition").should("be.visible");

    cy.contains("button", "Go Back").click();
    cy.url().should("include", "/dashboard");
  });

  it("should navigate to weekly plan", () => {
    cy.contains("button", "Plan").click();
    cy.url().should("include", "tab=plan");

    cy.contains("Weekly Plan").should("be.visible");

    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });

    cy.contains(currentDay).should("be.visible");
    cy.contains(currentDay).click();

    cy.contains("BREAKFAST").should("be.visible");
    cy.contains("LUNCH").should("be.visible");
    cy.contains("DINNER").should("be.visible");
  });

  it("should display nutrition tracking", () => {
    cy.contains("button", "Nutrition").click();
    cy.url().should("include", "tab=nutrition");

    cy.contains("Nutrition Tracking").should("be.visible");
  });

  it("should swap a meal", () => {
    cy.contains("button", "Plan").click();

    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });
    cy.contains(currentDay).click();

    let originalMealName: string;

    cy.contains("BREAKFAST")
      .parent()
      .parent()
      .within(() => {
        cy.get("p")
          .eq(1)
          .invoke("text")
          .then((text) => {
            originalMealName = text;
          });

        cy.contains("button", "Swap meal").click();
      });

    cy.wait(500);
    cy.contains("Find Cheaper Meal").click();

    cy.wait(3000);

    cy.contains("BREAKFAST").should("be.visible");
  });

  it("should navigate between tabs and maintain state", () => {
    cy.contains("button", "Home").click();
    cy.contains("Your meals").should("be.visible");

    cy.contains("button", "Plan").click();
    cy.contains("Weekly Plan").should("be.visible");

    cy.contains("button", "Nutrition").click();
    cy.contains("Nutrition Tracking").should("be.visible");

    cy.contains("button", "Home").click();
    cy.contains("Your meals").should("be.visible");
  });

  it("should persist data after page refresh", () => {
    let spentBefore: string;

    cy.contains("Spent this week")
      .parent()
      .find("p")
      .first()
      .invoke("text")
      .then((text) => {
        spentBefore = text;
      });

    cy.reload();
    cy.wait(2000);

    cy.contains("Spent this week")
      .parent()
      .find("p")
      .first()
      .invoke("text")
      .then((text) => {
        expect(text).to.equal(spentBefore);
      });
  });

  it("should show eaten meals in weekly plan", () => {
    cy.contains("button", "Plan").click();

    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });
    cy.contains(currentDay).click();

    cy.get('[class*="bg-emerald"]').should("have.length.at.least", 1);
  });
});
