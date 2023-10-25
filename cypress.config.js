const { defineConfig } = require('cypress')

module.exports = defineConfig({

  env: {
    username: 'cytest@test.com',
    password: 'Welcome123',
    apiUrl: 'https://api.realworld.io',
  },

  e2e: {
    baseUrl: 'http://localhost:4200',
    excludeSpecPattern: ['**/1-getting-started', '**/2-advanced-examples'],
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    watchForFileChanges: false,

    setupNodeEvents(on, config) {
      const username = process.env.DB_USERNAME
      const password = process.env.PASSWORD

      if (!password) {
        throw new Error('Missing PASSWORD environment variable')
      }

      config.env = { username, password }

      return config
    },
  },
});
