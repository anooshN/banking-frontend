import './commands'

// Suppress uncaught exceptions from the app (e.g. ResizeObserver)
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver')) return false
  return true
})

beforeEach(() => {
  cy.intercept('GET', '/api/v1/accounts/**').as('getAccounts')
  cy.intercept('GET', '/api/v1/transactions/**').as('getTransactions')
  cy.intercept('POST', '/api/v1/auth/login').as('login')
})
