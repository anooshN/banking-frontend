import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    env: {
      API_URL: 'http://localhost:8080',
      TEST_EMAIL: 'e2e@banking.com',
      TEST_PASSWORD: 'SecurePass@123',
    },
    setupNodeEvents(on, config) {
      // task: reset test database
      on('task', {
        log(message) { console.log(message); return null; },
      })
    },
  },
})
