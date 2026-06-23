/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>
      logout(): Chainable<void>
      getByTestId(id: string): Chainable<JQuery<HTMLElement>>
    }
  }
}

// Login command — calls API directly and sets localStorage
Cypress.Commands.add('login', (
  email = Cypress.env('TEST_EMAIL'),
  password = Cypress.env('TEST_PASSWORD')
) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/api/v1/auth/login`,
    body: { email, password },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200) {
      const { accessToken, refreshToken, userId, email: userEmail, roles } = response.body.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('userId', userId)
      localStorage.setItem('email', userEmail)
      localStorage.setItem('roles', JSON.stringify(roles))
    }
  })
})

Cypress.Commands.add('logout', () => {
  localStorage.clear()
  cy.visit('/login')
})

Cypress.Commands.add('getByTestId', (id: string) => {
  return cy.get(`[data-testid="${id}"]`)
})

export {}
