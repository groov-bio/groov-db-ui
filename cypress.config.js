const { defineConfig } = require('cypress');

module.exports = defineConfig({
  component: {
    video: false,
    screenshotOnRunFailure: false,
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalStudio: true,
    blockHosts: ['*.google-analytics.com'],
    video: false,
    experimentalRunAllSpecs: true,
    env: {
      cognito_username: 'your-test-user@example.com',
      cognito_password: 'your-test-password',
    },
  },
});
