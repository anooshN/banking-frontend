describe('Transactions Page', () => {
  const mockTxns = Array.from({ length: 5 }, (_, i) => ({
    id: `txn-00${i}`,
    referenceNumber: `TXN${String(i).padStart(10, '0')}`,
    accountId: 'acc-001',
    transactionType: i % 2 === 0 ? 'CREDIT' : 'DEBIT',
    status: 'COMPLETED',
    amount: (i + 1) * 100.50,
    balanceBefore: 10000,
    balanceAfter: i % 2 === 0 ? 10100.50 : 9900.50,
    description: `Transaction ${i + 1}`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString()
  }))

  beforeEach(() => {
    cy.intercept('GET', '/api/v1/accounts/user/*', {
      statusCode: 200,
      body: { success: true, data: [{
        id: 'acc-001', accountNumber: 'ACC1234567890',
        accountType: 'CHECKING', status: 'ACTIVE',
        balance: 10000, availableBalance: 10000,
        currencyCode: 'USD', routingNumber: '021000021',
        createdAt: new Date().toISOString()
      }]}
    })

    cy.intercept('GET', '/api/v1/transactions/account/*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          content: mockTxns, pageNumber: 0, pageSize: 20,
          totalElements: 5, totalPages: 1, last: true, first: true
        }
      }
    }).as('getTransactions')

    cy.login()
    cy.visit('/transactions')
    cy.wait('@getTransactions')
  })

  it('should display all transactions in table', () => {
    cy.contains('Transactions').should('be.visible')
    mockTxns.forEach(t => {
      cy.contains(t.description).should('be.visible')
    })
  })

  it('should filter by search term', () => {
    cy.get('input[placeholder="Search transactions..."]').type('Transaction 1')
    cy.contains('Transaction 1').should('be.visible')
  })

  it('should show correct credit/debit colors', () => {
    cy.contains('+$100.50').should('have.class', 'text-green-600')
    cy.contains('-$201.00').should('have.class', 'text-red-600')
  })

  it('should show completed status badge', () => {
    cy.contains('COMPLETED').should('be.visible')
  })
})
