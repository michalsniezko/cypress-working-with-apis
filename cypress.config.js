const { defineConfig } = require('cypress')

module.exports = defineConfig({

  env: {
    username: 'this is username from cypress.config.js env object',
    password: 'this is password from cypress.config.js env object',
    apiUrl: 'https://api.realworld.io',
  },

  retries: {
    runMode: 2,
    openMode: 0
  },

  e2e: {
    baseUrl: 'http://localhost:4200',
    excludeSpecPattern: ['**/1-getting-started', '**/2-advanced-examples'],
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    watchForFileChanges: false,

    setupNodeEvents(on, config) {
      // const username = process.env.DB_USERNAME
      // const password = process.env.PASSWORD

      // if (!password) {
      //   throw new Error('Missing PASSWORD environment variable')
      // }

      // config.env = { username, password }

      // return config
    },
  },
});
