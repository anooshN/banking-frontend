describe('Accounts Page', () => {
  const mockAccounts = [
    {
      id: 'acc-001',
      accountNumber: 'ACC1234567890',
      accountType: 'CHECKING',
      status: 'ACTIVE',
      balance: 15250.75,
      availableBalance: 15000.00,
      currencyCode: 'USD',
      routingNumber: '021000021',
      createdAt: new Date().toISOString()
    }
  ]

  beforeEach(() => {
    cy.intercept('GET', '/api/v1/accounts/user/*', {
      statusCode: 200,
      body: { success: true, data: mockAccounts }
    }).as('getAccounts')

    cy.login()
    cy.visit('/accounts')
    cy.wait('@getAccounts')
  })

  it('should display account cards', () => {
    cy.contains('CHECKING').should('be.visible')
    cy.contains('$15,250.75').should('be.visible')
    cy.contains('ACTIVE').should('be.visible')
  })

  it('should show account number masked', () => {
    cy.contains('ACC1234567890').should('be.visible')
  })

  it('should show Open Account button', () => {
    cy.contains('Open Account').should('be.visible')
  })

  it('should show account type selector when opening an account', () => {
    cy.contains('Open Account').click()
    cy.contains('CHECKING').should('be.visible')
    cy.contains('SAVINGS').should('be.visible')
    cy.contains('INVESTMENT').should('be.visible')
    cy.contains('Create Account').should('be.visible')
  })

  it('should create a new account', () => {
    const newAccount = { ...mockAccounts[0], id: 'acc-002', accountType: 'SAVINGS', accountNumber: 'ACC9999' }

    cy.intercept('POST', '/api/v1/accounts/user/*', {
      statusCode: 200,
      body: { success: true, data: newAccount }
    }).as('createAccount')

    cy.intercept('GET', '/api/v1/accounts/user/*', {
      statusCode: 200,
      body: { success: true, data: [...mockAccounts, newAccount] }
    }).as('getAccountsRefreshed')

    cy.contains('Open Account').click()
    cy.contains('SAVINGS').click()
    cy.contains('Create Account').click()
    cy.wait('@createAccount')
  })
})
