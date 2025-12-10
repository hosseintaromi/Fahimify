describe("Simple Test", () => {
  it("should visit home page", () => {
    cy.visit("http://localhost:3000");
    cy.wait(2000);
  });

  it("should login successfully", () => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[id="login-username"]').type("testuser");
    cy.get('input[id="login-password"]').type("testpass123");
    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.url().should("not.include", "/login");
  });

  it("should see dashboard after login", () => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[id="login-username"]').type("testuser");
    cy.get('input[id="login-password"]').type("testpass123");
    cy.get('button[type="submit"]').click();
    cy.wait(5000);

    cy.get("body").should("be.visible");
  });
});
