const { defineConfig } = require('cypress')

module.exports = defineConfig({

  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },

  env: {
    username: 'this is username from cypress.config.js env object, create cypress.env.json',
    password: 'this is password from cypress.config.js env object, create cypress.env.json',
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
