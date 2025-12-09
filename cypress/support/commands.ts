Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login')
  cy.get('input[id*="username"]').first().type(username)
  cy.get('input[id*="password"]').first().type(password)
  cy.get('button[type="submit"]').first().click()
  cy.url().should('not.include', '/login')
})

Cypress.Commands.add('clearCookies', () => {
  cy.clearCookies()
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>
      clearCookies(): Chainable<void>
    }
  }
}

export {}

