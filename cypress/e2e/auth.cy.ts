describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should display the login form', () => {
    cy.contains('BankingApp').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Sign In')
  })

  it('should show validation error for invalid email', () => {
    cy.get('input[type="email"]').type('not-an-email')
    cy.get('input[type="password"]').type('anypassword')
    cy.get('button[type="submit"]').click()
    cy.contains('Invalid email address').should('be.visible')
  })

  it('should show error for invalid credentials', () => {
    cy.intercept('POST', '/api/v1/auth/login', {
      statusCode: 401,
      body: { success: false, message: 'Invalid credentials', errorCode: 'INVALID_CREDENTIALS' }
    }).as('failedLogin')

    cy.get('input[type="email"]').type('wrong@example.com')
    cy.get('input[type="password"]').type('WrongPassword!')
    cy.get('button[type="submit"]').click()
    cy.wait('@failedLogin')
    cy.contains('Invalid credentials').should('be.visible')
  })

  it('should login successfully and redirect to dashboard', () => {
    cy.intercept('POST', '/api/v1/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          accessToken: 'mock.access.token',
          refreshToken: 'mock.refresh.token',
          userId: 'user-123',
          email: 'test@banking.com',
          roles: ['ROLE_CUSTOMER'],
          mfaRequired: false
        }
      }
    }).as('loginSuccess')

    cy.get('input[type="email"]').type('test@banking.com')
    cy.get('input[type="password"]').type('SecurePass@123')
    cy.get('button[type="submit"]').click()
    cy.wait('@loginSuccess')
    cy.url().should('include', '/dashboard')
  })

  it('should redirect unauthenticated users to login', () => {
    cy.visit('/dashboard')
    cy.url().should('include', '/login')
  })

  it('should logout and clear session', () => {
    cy.login()
    cy.visit('/dashboard')
    cy.contains('Logout').click()
    cy.url().should('include', '/login')
    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.be.null
    })
  })
})
