describe('Dashboard', () => {
  beforeEach(() => {
    cy.clearCookies()
  })

  it('should redirect unauthenticated user to login', () => {
    cy.visit('/')
    cy.url().should('include', '/login')
  })

  it('should show loading state initially', () => {
    const username = `dashboard_${Date.now()}`
    const password = 'testpass123'

    cy.visit('/login')
    cy.contains('Register').click()
    cy.get('input[id*="register-username"]').type(username)
    cy.get('input[id*="register-password"]').type(password)
    cy.get('button[type="submit"]').contains('Register').click()

    cy.contains('Loading your kitchen', { timeout: 10000 })
  })

  it('should persist authentication across page reloads', () => {
    const username = `persist_${Date.now()}`
    const password = 'testpass123'

    cy.visit('/login')
    cy.contains('Register').click()
    cy.get('input[id*="register-username"]').type(username)
    cy.get('input[id*="register-password"]').type(password)
    cy.get('button[type="submit"]').contains('Register').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')

    cy.reload()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})

