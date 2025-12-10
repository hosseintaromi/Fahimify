describe("Swap Meal Strategies", () => {
  const timestamp = Date.now();
  const testUser = {
    username: `swapper_${timestamp}`,
    email: `swapper_${timestamp}@test.com`,
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

    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });
    cy.contains(currentDay).click();
    cy.wait(500);
  });

  it("should swap meal with cheaper strategy", () => {
    let originalCost: number;

    cy.contains("BREAKFAST")
      .parent()
      .parent()
      .within(() => {
        cy.contains("Cost:")
          .invoke("text")
          .then((costText) => {
            const match = costText.match(/€(\d+\.\d+)/);
            if (match) {
              originalCost = parseFloat(match[1]);
              cy.wrap(originalCost).as("originalCost");
            }
          });

        cy.contains("button", "Swap meal").click();
      });

    cy.wait(300);
    cy.intercept("POST", "/api/plan/swap").as("swapMeal");
    cy.contains("button", "Find Cheaper Meal").click();
    cy.wait("@swapMeal", { timeout: 15000 });
    cy.wait(1000);

    cy.contains("BREAKFAST")
      .parent()
      .parent()
      .within(() => {
        cy.contains("Cost:")
          .invoke("text")
          .then((costText) => {
            const match = costText.match(/€(\d+\.\d+)/);
            if (match) {
              const newCost = parseFloat(match[1]);
              cy.get("@originalCost").then((original) => {
                expect(newCost).to.be.at.most(original as number);
              });
            }
          });
      });

    cy.contains("LUNCH").should("be.visible");
    cy.contains("DINNER").should("be.visible");
  });

  it("should swap meal with faster strategy", () => {
    let originalTime: number;

    cy.contains("LUNCH")
      .parent()
      .parent()
      .within(() => {
        cy.invoke("text").then((text) => {
          const match = text.match(/(\d+)m/);
          if (match) {
            originalTime = parseInt(match[1]);
            cy.wrap(originalTime).as("originalTime");
          }
        });

        cy.contains("button", "Swap meal").click();
      });

    cy.wait(300);
    cy.intercept("POST", "/api/plan/swap").as("swapMeal");
    cy.contains("button", "Find Faster Meal").click();
    cy.wait("@swapMeal", { timeout: 15000 });
    cy.wait(1000);

    cy.contains("LUNCH")
      .parent()
      .parent()
      .within(() => {
        cy.invoke("text").then((text) => {
          const match = text.match(/(\d+)m/);
          if (match) {
            const newTime = parseInt(match[1]);
            cy.get("@originalTime").then((original) => {
              expect(newTime).to.be.at.most(original as number);
            });
          }
        });
      });

    cy.contains("BREAKFAST").should("be.visible");
    cy.contains("DINNER").should("be.visible");
  });

  it("should swap meal with nutrient optimization strategy", () => {
    cy.contains("DINNER")
      .parent()
      .parent()
      .within(() => {
        cy.contains("button", "Swap meal").click();
      });

    cy.wait(300);
    cy.intercept("POST", "/api/plan/swap").as("swapMeal");
    cy.contains("button", "Optimize Nutrients").click();
    cy.wait("@swapMeal", { timeout: 15000 });
    cy.wait(1000);

    cy.contains("DINNER").should("be.visible");

    cy.contains("BREAKFAST").should("be.visible");
    cy.contains("LUNCH").should("be.visible");
  });

  it("should only change the swapped meal", () => {
    let breakfastBefore: string;
    let lunchBefore: string;

    cy.contains("BREAKFAST")
      .parent()
      .parent()
      .invoke("text")
      .then((text) => {
        breakfastBefore = text;
      });

    cy.contains("LUNCH")
      .parent()
      .parent()
      .invoke("text")
      .then((text) => {
        lunchBefore = text;
      });

    cy.contains("DINNER")
      .parent()
      .parent()
      .within(() => {
        cy.contains("button", "Swap meal").click();
      });

    cy.wait(300);
    cy.intercept("POST", "/api/plan/swap").as("swapMeal");
    cy.contains("button", "Find Cheaper Meal").click();
    cy.wait("@swapMeal", { timeout: 15000 });
    cy.wait(1000);

    cy.contains("BREAKFAST")
      .parent()
      .parent()
      .invoke("text")
      .then((text) => {
        expect(text).to.equal(breakfastBefore);
      });

    cy.contains("LUNCH")
      .parent()
      .parent()
      .invoke("text")
      .then((text) => {
        expect(text).to.equal(lunchBefore);
      });
  });

  it("should update total cost after swap", () => {
    cy.contains("button", "Home").click();

    cy.contains("Estimated weekly cost")
      .parent()
      .find("span")
      .invoke("text")
      .then((cost) => {
        const costValue = parseFloat(cost.replace("€", ""));
        expect(costValue).to.be.greaterThan(0);
        expect(costValue).to.be.lessThan(150);
      });
  });
});
