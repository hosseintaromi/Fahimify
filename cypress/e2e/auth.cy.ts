describe('Authentication', () => {
  beforeEach(() => {
    cy.clearCookies()
  })

  it('should display login page', () => {
    cy.visit('/login')
    cy.contains('Fahimify').should('be.visible')
    cy.contains('Login').should('be.visible')
    cy.contains('Register').should('be.visible')
  })

  it('should register a new user', () => {
    const username = `testuser_${Date.now()}`
    const password = 'testpass123'

    cy.visit('/login')
    cy.contains('Register').click()
    cy.get('input[id*="register-username"]').type(username)
    cy.get('input[id*="register-password"]').type(password)
    cy.get('button[type="submit"]').contains('Register').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.contains('Loading your kitchen', { timeout: 10000 })
  })

  it('should show error for duplicate username', () => {
    const username = `duplicate_${Date.now()}`
    const password = 'testpass123'

    cy.visit('/login')
    cy.contains('Register').click()
    cy.get('input[id*="register-username"]').type(username)
    cy.get('input[id*="register-password"]').type(password)
    cy.get('button[type="submit"]').contains('Register').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')

    cy.clearCookies()
    cy.visit('/login')
    cy.contains('Register').click()
    cy.get('input[id*="register-username"]').type(username)
    cy.get('input[id*="register-password"]').type(password)
    cy.get('button[type="submit"]').contains('Register').click()

    cy.contains('Username already exists').should('be.visible')
  })

  it('should login with valid credentials', () => {
    const username = `logintest_${Date.now()}`
    const password = 'testpass123'

    cy.visit('/login')
    cy.contains('Register').click()
    cy.get('input[id*="register-username"]').type(username)
    cy.get('input[id*="register-password"]').type(password)
    cy.get('button[type="submit"]').contains('Register').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')

    cy.clearCookies()
    cy.visit('/login')
    cy.get('input[id*="login-username"]').type(username)
    cy.get('input[id*="login-password"]').type(password)
    cy.get('button[type="submit"]').contains('Login').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should show error for invalid credentials', () => {
    cy.visit('/login')
    cy.get('input[id*="login-username"]').type('nonexistent')
    cy.get('input[id*="login-password"]').type('wrongpass')
    cy.get('button[type="submit"]').contains('Login').click()

    cy.contains('Invalid username or password').should('be.visible')
  })

  it('should redirect authenticated user away from login page', () => {
    const username = `redirecttest_${Date.now()}`
    const password = 'testpass123'

    cy.visit('/login')
    cy.contains('Register').click()
    cy.get('input[id*="register-username"]').type(username)
    cy.get('input[id*="register-password"]').type(password)
    cy.get('button[type="submit"]').contains('Register').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')

    cy.visit('/login')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should require minimum password length', () => {
    cy.visit('/login')
    cy.contains('Register').click()
    cy.get('input[id*="register-username"]').type('testuser')
    cy.get('input[id*="register-password"]').type('123')
    cy.get('button[type="submit"]').contains('Register').click()

    cy.contains('Password must be at least 6 characters').should('be.visible')
  })
})

