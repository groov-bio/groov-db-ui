# Cypress Testing with Cognito Authentication

This setup provides simple mock authentication for testing components that require AWS Cognito authentication.

## Usage

### Basic Authentication Mock

To test authenticated routes, use the `mockCognitoAuth` command before visiting the page:

```javascript
describe('Authenticated Pages', () => {
  beforeEach(() => {
    cy.mockCognitoAuth();
    cy.visit('/addSensor');
  });

  it('should display the add sensor page', () => {
    cy.contains('Add Sensor').should('be.visible');
  });
});
```

### Clearing Authentication

To test logout or unauthenticated scenarios:

```javascript
it('should redirect to login when not authenticated', () => {
  cy.clearAuth();
  cy.visit('/addSensor');
  cy.url().should('include', '/account');
});
```

## How It Works

1. **`mockCognitoAuth()`** - Sets up fake JWT tokens in localStorage that mimic what AWS Amplify creates
2. **`clearAuth()`** - Removes all authentication tokens
3. **Production Safe** - Only works when `window.Cypress` exists (during tests)
4. **Simple** - No real AWS calls, just local storage manipulation

## Configuration

Update the test credentials in `cypress.config.js` if needed:

```javascript
env: {
  cognito_username: 'your-test-user@example.com',
  cognito_password: 'your-test-password',
}
```

The mock uses fake tokens that work with your app's authentication flow without requiring real Cognito interactions.
