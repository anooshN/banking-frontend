describe('Transfers Page', () => {
  beforeEach(() => {
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
    cy.visit('/transfers')
  })

  it('should show transfer form', () => {
    cy.contains('Transfers').should('be.visible')
    cy.contains('INTERNAL').should('be.visible')
    cy.contains('SWIFT').should('be.visible')
    cy.contains('Initiate Transfer').should('be.visible')
  })

  it('should switch payment rails', () => {
    cy.contains('SWIFT').click()
    cy.contains('Bank Code (SWIFT/BIC/ABA)').should('be.visible')
  })

  it('should submit transfer successfully', () => {
    cy.intercept('POST', '/api/v1/payments/initiate', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          id: 'pay-001',
          paymentReference: 'INT1234567890',
          status: 'INITIATED'
        }
      }
    }).as('initiatePayment')

    cy.get('input[name="receiverAccountNumber"]').type('ACC9876543210')
    cy.get('input[name="receiverName"]').type('Jane Smith')
    cy.get('input[name="amount"]').type('500')
    cy.get('input[name="description"]').type('Rent payment')
    cy.contains('Initiate Transfer').click()
    cy.wait('@initiatePayment')
    cy.contains('Transfer Initiated!').should('be.visible')
  })

  it('should allow another transfer after success', () => {
    cy.intercept('POST', '/api/v1/payments/initiate', {
      statusCode: 200,
      body: { success: true, data: { id: 'pay-001', paymentReference: 'INT001', status: 'INITIATED' } }
    })

    cy.get('input[name="receiverAccountNumber"]').type('ACC9876543210')
    cy.get('input[name="receiverName"]').type('Bob')
    cy.get('input[name="amount"]').type('100')
    cy.contains('Initiate Transfer').click()
    cy.contains('Make Another Transfer').click()
    cy.contains('Transfers').should('be.visible')
  })
})
