describe('Loans Page', () => {
  const mockLoan = {
    id: 'loan-001',
    loanNumber: 'LOAN1234567890',
    userId: 'user-123',
    accountId: 'acc-001',
    loanType: 'PERSONAL',
    status: 'ACTIVE',
    principalAmount: 25000,
    outstandingBalance: 22350.50,
    interestRate: 9.5,
    tenureMonths: 36,
    emiAmount: 798.35,
    purpose: 'Home renovation',
    nextEmiDate: new Date(Date.now() + 15 * 86400000).toISOString(),
    createdAt: new Date().toISOString()
  }

  beforeEach(() => {
    cy.intercept('GET', '/api/v1/loans', {
      statusCode: 200,
      body: { success: true, data: [mockLoan] }
    }).as('getLoans')

    cy.intercept('GET', '/api/v1/accounts/user/*', {
      statusCode: 200,
      body: {
        success: true,
        data: [{
          id: 'acc-001', accountNumber: 'ACC1234567890',
          accountType: 'CHECKING', status: 'ACTIVE',
          balance: 50000, availableBalance: 50000,
          currencyCode: 'USD', routingNumber: '021000021',
          createdAt: new Date().toISOString()
        }]
      }
    })

    cy.login()
    cy.visit('/loans')
    cy.wait('@getLoans')
  })

  it('should display existing loan', () => {
    cy.contains('PERSONAL LOAN').should('be.visible')
    cy.contains('Home renovation').should('be.visible')
    cy.contains('$25,000.00').should('be.visible')
    cy.contains('$798.35/mo').should('be.visible')
    cy.contains('ACTIVE').should('be.visible')
  })

  it('should show Apply for Loan button', () => {
    cy.contains('Apply for Loan').should('be.visible')
  })

  it('should show loan application form', () => {
    cy.contains('Apply for Loan').click()
    cy.contains('Loan Application').should('be.visible')
    cy.contains('PERSONAL').should('be.visible')
    cy.contains('Submit Application').should('be.visible')
  })

  it('should calculate EMI preview', () => {
    cy.contains('Apply for Loan').click()
    cy.get('input[type="number"]').first().type('10000')
    cy.contains('Estimated EMI').should('be.visible')
  })
})
