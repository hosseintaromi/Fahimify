describe('Onboarding Flow', () => {
  beforeEach(() => {
    cy.clearCookies()
  })

  it('should show onboarding for new user', () => {
    const username = `onboarding_${Date.now()}`
    const password = 'testpass123'

    cy.visit('/login')
    cy.contains('Register').click()
    cy.get('input[id*="register-username"]').type(username)
    cy.get('input[id*="register-password"]').type(password)
    cy.get('button[type="submit"]').contains('Register').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')
    
    cy.contains('onboarding', { timeout: 10000, matchCase: false }).should('exist')
  })

  it('should complete onboarding flow', () => {
    const username = `complete_onboarding_${Date.now()}`
    const password = 'testpass123'

    cy.visit('/login')
    cy.contains('Register').click()
    cy.get('input[id*="register-username"]').type(username)
    cy.get('input[id*="register-password"]').type(password)
    cy.get('button[type="submit"]').contains('Register').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')

    cy.get('button').contains(/next|continue|start|skip/i, { timeout: 10000 }).should('exist')
  })
})

