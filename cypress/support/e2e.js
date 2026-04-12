// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Stub feature flags so tests always run against the V1 form.
// When the V2 add-sensor form is ready for testing, remove this intercept
// (or flip v2_add_sensor_form to true for the relevant specs).
beforeEach(() => {
  cy.intercept('GET', 'https://groov-api.com/feature-flags.json', {
    body: {
      v2_add_sensor_form: { local: false, prod: false },
      v2_api: { local: false, prod: false },
      v2_admin_portal: { local: false, prod: false },
      v2_sensor_page: { local: false, prod: false },
    },
  }).as('featureFlags');
});
