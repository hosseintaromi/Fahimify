describe("Weekly Plan Day Filtering", () => {
  const timestamp = Date.now();
  const testUser = {
    username: `filter_test_${timestamp}`,
    email: `filter_test_${timestamp}@test.com`,
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
    cy.login(testUser.email, testUser.password);
    cy.contains("button", "Plan").click();
  });

  it("should only show current and future days", () => {
    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });

    const allDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const currentDayIndex = allDays.indexOf(currentDay);

    if (currentDayIndex === -1) {
      cy.log("Could not determine current day");
      return;
    }

    const futureDays = allDays.slice(currentDayIndex);
    const pastDays = allDays.slice(0, currentDayIndex);

    futureDays.forEach((day) => {
      cy.contains(day).should("be.visible");
    });

    if (pastDays.length > 0) {
      pastDays.forEach((day) => {
        cy.contains(day).should("not.exist");
      });
    }
  });

  it("should have current day expanded by default", () => {
    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });

    cy.contains(currentDay).should("be.visible");

    cy.contains(currentDay)
      .parent()
      .parent()
      .within(() => {
        cy.contains("Hide plan").should("be.visible");
        cy.contains("BREAKFAST").should("be.visible");
        cy.contains("LUNCH").should("be.visible");
        cy.contains("DINNER").should("be.visible");
      });
  });

  it("should allow expanding future days", () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.toLocaleDateString("en-US", {
      weekday: "long",
    });

    cy.contains(tomorrowDay).click();

    cy.contains(tomorrowDay)
      .parent()
      .parent()
      .within(() => {
        cy.contains("BREAKFAST").should("be.visible");
        cy.contains("LUNCH").should("be.visible");
        cy.contains("DINNER").should("be.visible");
      });
  });

  it("should collapse days when clicked again", () => {
    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });

    cy.contains(currentDay).click();

    cy.contains(currentDay)
      .parent()
      .parent()
      .within(() => {
        cy.contains("View plan").should("be.visible");
        cy.contains("BREAKFAST").should("not.exist");
      });

    cy.contains(currentDay).click();

    cy.contains(currentDay)
      .parent()
      .parent()
      .within(() => {
        cy.contains("Hide plan").should("be.visible");
        cy.contains("BREAKFAST").should("be.visible");
      });
  });

  it("should show eaten status for current day meals", () => {
    cy.contains("button", "Home").click();

    cy.contains("Breakfast")
      .parents('[class*="rounded"]')
      .first()
      .within(() => {
        cy.contains("button", "Mark").click();
      });

    cy.wait(2000);

    cy.contains("button", "Plan").click();

    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });

    cy.contains(currentDay).should("be.visible");

    cy.contains("BREAKFAST").parent().parent().should("contain", "Eaten");
  });

  it("should allow swapping meals on future days", () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.toLocaleDateString("en-US", {
      weekday: "long",
    });

    cy.contains(tomorrowDay).click();
    cy.wait(500);

    cy.contains("BREAKFAST")
      .parent()
      .parent()
      .within(() => {
        cy.contains("button", "Swap meal").should("be.visible");
        cy.contains("button", "Swap meal").click();
      });

    cy.contains("Find Cheaper Meal").should("be.visible");
    cy.contains("Find Faster Meal").should("be.visible");
    cy.contains("Optimize Nutrients").should("be.visible");

    cy.get("body").click(0, 0);
  });

  it("should maintain day filtering after page refresh", () => {
    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });

    cy.reload();
    cy.wait(1000);

    cy.contains("button", "Plan").click();

    cy.contains(currentDay).should("be.visible");

    const allDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const currentDayIndex = allDays.indexOf(currentDay);
    const pastDays = allDays.slice(0, currentDayIndex);

    if (pastDays.length > 0) {
      pastDays.forEach((day) => {
        cy.contains(day).should("not.exist");
      });
    }
  });

  it("should show all meals for visible days", () => {
    const today = new Date();
    const allDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });
    const currentDayIndex = allDays.indexOf(currentDay);
    const visibleDays = allDays.slice(currentDayIndex);

    visibleDays.forEach((day) => {
      cy.contains(day).click();
      cy.wait(300);

      cy.contains(day)
        .parent()
        .parent()
        .within(() => {
          cy.contains("BREAKFAST").should("be.visible");
          cy.contains("LUNCH").should("be.visible");
          cy.contains("DINNER").should("be.visible");
        });

      cy.contains(day).click();
      cy.wait(300);
    });
  });
});
