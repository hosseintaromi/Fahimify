describe("Navigation & Persistence", () => {
  const timestamp = Date.now();
  const testUser = {
    username: `persistent_${timestamp}`,
    email: `persistent_${timestamp}@test.com`,
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

  it("should persist data across tab navigation", () => {
    cy.login(testUser.username, testUser.password);

    cy.contains("Breakfast")
      .parents('[class*="rounded"]')
      .first()
      .within(() => {
        cy.contains("button", "Mark").click();
      });

    cy.wait(2000);

    let spentAmount: string;
    cy.getSpent().then((spent) => {
      spentAmount = spent;
    });

    cy.contains("button", "Plan").click();
    cy.url().should("include", "tab=plan");
    cy.contains("Weekly Plan").should("be.visible");

    cy.contains("button", "Nutrition").click();
    cy.url().should("include", "tab=nutrition");
    cy.contains("Nutrition Tracking").should("be.visible");

    cy.contains("button", "Home").click();
    cy.url().should("include", "/dashboard");
    cy.url().should("not.include", "tab=");

    cy.getSpent().then((spent) => {
      expect(spent).to.equal(spentAmount);
    });

    cy.contains("Breakfast")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");
  });

  it("should persist session after page refresh", () => {
    cy.login(testUser.username, testUser.password);

    cy.getSpent().then((spentBefore) => {
      cy.reload();
      cy.wait(1000);

      cy.url().should("include", "/dashboard");
      cy.contains("Your meals").should("be.visible");

      cy.getSpent().then((spentAfter) => {
        expect(spentAfter).to.equal(spentBefore);
      });

      cy.contains("Breakfast")
        .parents('[class*="rounded"]')
        .first()
        .should("contain", "Eaten");
    });
  });

  it("should maintain authentication after browser back/forward", () => {
    cy.login(testUser.username, testUser.password);

    cy.contains("button", "Plan").click();
    cy.wait(500);

    cy.go("back");
    cy.wait(500);
    cy.url().should("include", "/dashboard");
    cy.contains("Your meals").should("be.visible");

    cy.go("forward");
    cy.wait(500);
    cy.url().should("include", "tab=plan");
    cy.contains("Weekly Plan").should("be.visible");
  });

  it("should preserve eaten meals across multiple sessions", () => {
    cy.login(testUser.username, testUser.password);

    cy.contains("Lunch")
      .parents('[class*="rounded"]')
      .first()
      .within(() => {
        cy.contains("button", "Mark").click();
      });

    cy.wait(2000);

    cy.clearCookies();
    cy.clearLocalStorage();

    cy.login(testUser.username, testUser.password);

    cy.contains("Breakfast")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");
    cy.contains("Lunch")
      .parents('[class*="rounded"]')
      .first()
      .should("contain", "Eaten");

    cy.getSpent().then((spent) => {
      const spentValue = parseFloat(spent.replace("€", ""));
      expect(spentValue).to.be.greaterThan(0);
    });
  });

  it("should handle direct URL navigation", () => {
    cy.login(testUser.username, testUser.password);

    cy.visit("/dashboard?tab=plan");
    cy.contains("Weekly Plan").should("be.visible");

    cy.visit("/dashboard?tab=nutrition");
    cy.contains("Nutrition Tracking").should("be.visible");

    cy.visit("/dashboard");
    cy.contains("Your meals").should("be.visible");
  });

  it("should redirect to login when not authenticated", () => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.visit("/dashboard");
    cy.url().should("include", "/login");

    cy.visit("/dashboard?tab=plan");
    cy.url().should("include", "/login");
  });

  it("should maintain meal log history", () => {
    cy.login(testUser.username, testUser.password);

    cy.contains("Dinner")
      .parents('[class*="rounded"]')
      .first()
      .within(() => {
        cy.contains("button", "Mark").click();
      });

    cy.wait(2000);

    cy.contains("button", "Nutrition").click();

    cy.contains("Nutrition Tracking").should("be.visible");

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
});
