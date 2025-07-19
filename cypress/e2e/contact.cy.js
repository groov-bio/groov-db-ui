describe('Contact form spec', () => {
  it('should display the contact form', () => {
    // Mock API calls that components make on mount
    cy.intercept('GET', 'https://groov-api.com/index.json', {
      fixture: 'baseSearchResponse.json',
    }).as('search');
    cy.intercept('GET', 'https://groov-api.com/all-sensors.json', {
      fixture: 'baseSearchResponse.json',
    }).as('allSensors');
    cy.intercept('POST', 'https://api.groov.bio/contact_form', {
      fixture: 'empty.json',
    }).as('contactForm');
    cy.intercept('POST', 'https://www.google-analytics.com/g/collect', {
      statusCode: 200,
      body: {},
    }).as('googleAnalytics');

    cy.visit('http://localhost:3000');
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(3) > a').click();
    cy.get(
      '[href="/about/contact"] > .MuiListItemText-root > .MuiTypography-root'
    ).click();
    cy.get('.css-1isinvg > .MuiTypography-root').should(
      'have.text',
      'Contact Us'
    );
    cy.get('.css-1ebprri > .MuiBox-root').click();
    /* ==== End Cypress Studio ==== */
  });
  it('Should show success message when form is submitted', () => {
    // Mock common API calls that components make on mount
    cy.intercept('GET', 'https://groov-api.com/index.json', {
      fixture: 'baseSearchResponse.json',
    }).as('search');
    cy.intercept('GET', 'https://groov-api.com/all-sensors.json', {
      fixture: 'baseSearchResponse.json',
    }).as('allSensors');
    cy.intercept('POST', 'https://www.google-analytics.com/g/collect', {
      statusCode: 200,
      body: {},
    }).as('googleAnalytics');

    cy.intercept('POST', 'https://api.groov.bio/contact_form', {
      fixture: 'empty.json',
    }).as('contact-form-success');
    cy.visit('http://localhost:3000');
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(3) > a').click();
    cy.get(
      '[href="/about/contact"] > .MuiListItemText-root > .MuiTypography-root'
    ).click();
    cy.get('#\\:r2\\:').clear('j');
    cy.get('#\\:r2\\:').type('josh test');
    cy.get('#\\:r3\\:').clear('j');
    cy.get('#\\:r3\\:').type('josh@test.com');
    cy.get('#\\:r4\\:').click();
    cy.get('#\\:r4\\:').type('some test message');
    cy.get('form > .MuiButtonBase-root').click();
    cy.get('.css-ix1f03-MuiTypography-root').should(
      'have.text',
      'Message sent successfully!'
    );
    cy.get('.css-ix1f03-MuiTypography-root').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });
  it('Should show error message when the API fails', () => {
    // Mock common API calls that components make on mount
    cy.intercept('GET', 'https://groov-api.com/index.json', {
      fixture: 'baseSearchResponse.json',
    }).as('search');
    cy.intercept('GET', 'https://groov-api.com/all-sensors.json', {
      fixture: 'baseSearchResponse.json',
    }).as('allSensors');
    cy.intercept('POST', 'https://www.google-analytics.com/g/collect', {
      statusCode: 200,
      body: {},
    }).as('googleAnalytics');

    cy.intercept('POST', 'https://api.groov.bio/contact_form', {
      fixture: 'empty.json',
      statusCode: 400,
    }).as('contact-form-success');
    cy.visit('http://localhost:3000');
    cy.get(':nth-child(3) > a').click();
    cy.get(
      '[href="/about/contact"] > .MuiListItemText-root > .MuiTypography-root'
    ).click();
    cy.get('#\\:r2\\:').clear('j');
    cy.get('#\\:r2\\:').type('josh test');
    cy.get('#\\:r3\\:').clear('j');
    cy.get('#\\:r3\\:').type('josh@test.com');
    cy.get('#\\:r4\\:').click();
    cy.get('#\\:r4\\:').type('some test message');
    cy.get('form > .MuiButtonBase-root').click();
    cy.get('.css-ix1f03-MuiTypography-root').should(
      'have.text',
      'Failed to send message.'
    );
    cy.get('.css-ix1f03-MuiTypography-root').should('be.visible');
  });
});
