describe('Dashboard', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/accounts/user/*', {
      statusCode: 200,
      body: {
        success: true,
        data: [
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
          },
          {
            id: 'acc-002',
            accountNumber: 'ACC9876543210',
            accountType: 'SAVINGS',
            status: 'ACTIVE',
            balance: 42000.00,
            availableBalance: 42000.00,
            currencyCode: 'USD',
            routingNumber: '021000021',
            createdAt: new Date().toISOString()
          }
        ]
      }
    }).as('getAccounts')

    cy.intercept('GET', '/api/v1/transactions/account/*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          content: [
            {
              id: 'txn-001',
              referenceNumber: 'TXN1234567890',
              accountId: 'acc-001',
              transactionType: 'CREDIT',
              status: 'COMPLETED',
              amount: 5000.00,
              balanceBefore: 10250.75,
              balanceAfter: 15250.75,
              description: 'Salary deposit',
              createdAt: new Date().toISOString()
            },
            {
              id: 'txn-002',
              referenceNumber: 'TXN0987654321',
              accountId: 'acc-001',
              transactionType: 'DEBIT',
              status: 'COMPLETED',
              amount: 120.50,
              balanceBefore: 15371.25,
              balanceAfter: 15250.75,
              description: 'Utility bill',
              createdAt: new Date().toISOString()
            }
          ],
          pageNumber: 0,
          pageSize: 5,
          totalElements: 2,
          totalPages: 1,
          last: true,
          first: true
        }
      }
    }).as('getTransactions')

    cy.login()
    cy.visit('/dashboard')
  })

  it('should display total balance', () => {
    cy.wait('@getAccounts')
    cy.contains('$57,250.75').should('be.visible')
  })

  it('should show account count', () => {
    cy.wait('@getAccounts')
    cy.contains('2').should('be.visible')
  })

  it('should display recent transactions', () => {
    cy.wait('@getTransactions')
    cy.contains('Salary deposit').should('be.visible')
    cy.contains('Utility bill').should('be.visible')
    cy.contains('+$5,000.00').should('be.visible')
    cy.contains('-$120.50').should('be.visible')
  })

  it('should show both accounts in account list', () => {
    cy.wait('@getAccounts')
    cy.contains('CHECKING').should('be.visible')
    cy.contains('SAVINGS').should('be.visible')
  })
})
