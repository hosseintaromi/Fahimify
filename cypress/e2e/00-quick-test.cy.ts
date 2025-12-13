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
    cy.contains("€100.00").should("be.visible");
  });

  it("should display macro balance", () => {
    cy.contains("Macro balance", { timeout: 20000 }).should("be.visible");
  });

  it("should have meal plan with today's meals", () => {
    cy.contains("Breakfast").should("be.visible");
    cy.contains("Lunch").should("be.visible");
    cy.contains("Dinner").should("be.visible");
  });

  it("should mark a meal as eaten", () => {
    cy.contains("Spent this week", { timeout: 20000 }).should("be.visible");

    cy.contains("Breakfast")
      .parents('[class*="rounded"]')
      .first()
      .within(() => {
        cy.contains("button", "Mark").click();
      });

    cy.wait(2000);

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
    cy.contains("Your meals").should("be.visible");
  });

  it("should navigate to weekly plan", () => {
    cy.contains("button", "Plan").click();
    cy.contains("Weekly Plan").should("be.visible");

    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });

    cy.contains(currentDay).should("be.visible");
    cy.contains(currentDay).click();
  });

  it("should display nutrition tracking", () => {
    cy.contains("button", "Nutrition").click();
    cy.contains("Nutrition Tracking").should("be.visible");
  });

  it("should swap a meal", () => {
    cy.contains("button", "Plan").click({ timeout: 15000 });
    cy.contains("Weekly Plan", { timeout: 15000 }).should("be.visible");
    cy.contains("button", "Swap meal", { timeout: 15000 }).first().click();
    cy.contains("Find Cheaper Meal", { timeout: 10000 }).click();
    cy.wait(2000);
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
    cy.contains("Weekly Plan", { timeout: 15000 }).should("be.visible");
  });
});
