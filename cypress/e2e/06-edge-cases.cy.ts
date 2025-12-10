describe("Edge Cases", () => {
  describe("TC1: Duplicate Meal Log", () => {
    const timestamp = Date.now();
    const testUser = {
      username: `duplicate_${timestamp}`,
      email: `duplicate_${timestamp}@test.com`,
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

    it("should prevent duplicate meal logging", () => {
      cy.login(testUser.email, testUser.password);

      cy.contains("Breakfast")
        .parents('[class*="rounded"]')
        .first()
        .within(() => {
          cy.contains("button", "Mark").click();
        });

      cy.wait(1000);

      cy.contains("Breakfast")
        .parents('[class*="rounded"]')
        .first()
        .within(() => {
          cy.contains("Logged").should("exist");
          cy.contains("button", "Mark").should("not.exist");
        });

      cy.contains("Breakfast").parents('[class*="rounded"]').first().click();
      cy.url().should("include", "/recipe/");

      cy.contains("button", "Logged").should("be.visible");
      cy.contains("button", "Logged").should("be.disabled");
      cy.contains("button", "Mark as eaten").should("not.exist");
    });
  });

  describe("TC2: Budget Exceeded", () => {
    const timestamp = Date.now();
    const testUser = {
      username: `budget_exceed_${timestamp}`,
      email: `budget_exceed_${timestamp}@test.com`,
      password: "Test123!@#",
    };

    before(() => {
      cy.visit("/");
      cy.signup(testUser.username, testUser.email, testUser.password);
      cy.fixture("preferences").then((prefs) => {
        const lowBudget = { ...prefs.default, budget: 20 };
        cy.completeOnboarding(lowBudget);
      });
      cy.generatePlan();
    });

    it("should handle budget exceeded scenario", () => {
      cy.login(testUser.email, testUser.password);

      cy.contains("Breakfast")
        .parents('[class*="rounded"]')
        .first()
        .within(() => {
          cy.contains("button", "Mark").click();
        });
      cy.wait(2000);

      cy.contains("Lunch")
        .parents('[class*="rounded"]')
        .first()
        .within(() => {
          cy.contains("button", "Mark").click();
        });
      cy.wait(2000);

      cy.contains("Dinner")
        .parents('[class*="rounded"]')
        .first()
        .within(() => {
          cy.contains("button", "Mark").click();
        });
      cy.wait(2000);

      cy.getSpent().then((spent) => {
        const spentValue = parseFloat(spent.replace("€", ""));
        cy.getBudgetRemaining().then((remaining) => {
          const remainingValue = parseFloat(remaining.replace("€", ""));

          if (spentValue > 20) {
            expect(remainingValue).to.be.at.most(0);
          }
        });
      });
    });
  });

  describe("TC3: Recipe Detail Navigation", () => {
    const timestamp = Date.now();
    const testUser = {
      username: `nav_test_${timestamp}`,
      email: `nav_test_${timestamp}@test.com`,
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

    it("should navigate to recipe detail and back", () => {
      cy.login(testUser.email, testUser.password);

      cy.contains("Dinner").parents('[class*="rounded"]').first().click();

      cy.url().should("include", "/recipe/");
      cy.contains("Mark as eaten").should("be.visible");

      cy.contains("Ingredients").should("be.visible");
      cy.contains("Instructions").should("be.visible");
      cy.contains("Nutrition").should("be.visible");

      cy.contains("button", "Go Back").click();
      cy.url().should("include", "/dashboard");
      cy.contains("Your meals").should("be.visible");
    });

    it("should navigate from weekly plan to recipe detail", () => {
      cy.login(testUser.email, testUser.password);

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
      cy.contains("Mark as eaten").should("be.visible");

      cy.go("back");
      cy.url().should("include", "tab=plan");
    });
  });

  describe("TC4: Empty States", () => {
    const timestamp = Date.now();
    const testUser = {
      username: `empty_${timestamp}`,
      email: `empty_${timestamp}@test.com`,
      password: "Test123!@#",
    };

    before(() => {
      cy.visit("/");
      cy.signup(testUser.username, testUser.email, testUser.password);
      cy.fixture("preferences").then((prefs) => {
        cy.completeOnboarding(prefs.default);
      });
    });

    it("should show empty state when no plan exists", () => {
      cy.login(testUser.email, testUser.password);

      cy.contains("No plan yet").should("be.visible");
      cy.contains("Generate weekly plan").should("be.visible");
    });

    it("should show nutrition tracking empty state", () => {
      cy.login(testUser.email, testUser.password);

      cy.contains("button", "Nutrition").click();
      cy.contains("No nutrition data yet").should("be.visible");
    });

    it("should show plan tab empty state", () => {
      cy.login(testUser.email, testUser.password);

      cy.contains("button", "Plan").click();
      cy.contains("No weekly plan yet").should("be.visible");
    });
  });

  describe("TC5: Week Completion", () => {
    const timestamp = Date.now();
    const testUser = {
      username: `week_complete_${timestamp}`,
      email: `week_complete_${timestamp}@test.com`,
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

    it("should handle marking all weekly meals as eaten", () => {
      cy.login(testUser.email, testUser.password);

      cy.contains("button", "Plan").click();

      const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      const today = new Date();
      const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });
      const currentDayIndex = days.indexOf(currentDay);
      const futureDays = days.slice(currentDayIndex);

      futureDays.forEach((day, dayIndex) => {
        if (dayIndex > 0) {
          cy.contains("button", "Plan").click();
          cy.wait(500);
        }

        cy.contains(day).click();
        cy.wait(500);

        cy.contains("BREAKFAST")
          .parent()
          .parent()
          .within(() => {
            cy.contains("button", "View").click();
          });
        cy.wait(500);
        cy.contains("button", "Mark as eaten").click();
        cy.wait(1000);
        cy.go("back");
        cy.wait(500);

        cy.contains("LUNCH")
          .parent()
          .parent()
          .within(() => {
            cy.contains("button", "View").click();
          });
        cy.wait(500);
        cy.contains("button", "Mark as eaten").click();
        cy.wait(1000);
        cy.go("back");
        cy.wait(500);

        cy.contains("DINNER")
          .parent()
          .parent()
          .within(() => {
            cy.contains("button", "View").click();
          });
        cy.wait(500);
        cy.contains("button", "Mark as eaten").click();
        cy.wait(1000);
        cy.go("back");
        cy.wait(500);
      });

      cy.contains("button", "Home").click();

      cy.getSpent().then((spent) => {
        const spentValue = parseFloat(spent.replace("€", ""));
        expect(spentValue).to.be.greaterThan(0);
      });

      cy.getMacroPercent("PROTEIN").then((percent) => {
        const value = parseInt(percent.replace("%", ""));
        expect(value).to.be.greaterThan(0);
      });
    });
  });

  describe("TC6: Form Validation", () => {
    it("should validate signup form", () => {
      cy.visit("/signup");

      cy.get('button[type="submit"]').click();

      cy.contains("required").should("exist");
    });

    it("should validate login form", () => {
      cy.visit("/login");

      cy.get('button[type="submit"]').click();

      cy.contains("required").should("exist");
    });
  });

  describe("TC7: API Error Handling", () => {
    const timestamp = Date.now();
    const testUser = {
      username: `error_test_${timestamp}`,
      email: `error_test_${timestamp}@test.com`,
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

    it("should handle network errors gracefully", () => {
      cy.login(testUser.email, testUser.password);

      cy.intercept("POST", "/api/meal-log", { forceNetworkError: true }).as(
        "networkError"
      );

      cy.contains("Breakfast")
        .parents('[class*="rounded"]')
        .first()
        .within(() => {
          cy.contains("button", "Mark").click();
        });

      cy.wait("@networkError");
    });
  });
});
