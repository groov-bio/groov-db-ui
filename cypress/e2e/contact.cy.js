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
    cy.get('#About').click();
    cy.get(
      "#contact-about-route"
    ).click();
    cy.get('#about-contact-us-header').should(
      'have.text',
      'Contact Us'
    );
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
    cy.get('#About').click();
    cy.get(
      "#contact-about-route"
    ).click();
    cy.get('#contact-form-name').type('josh test');
    cy.get('#contact-form-email').type('josh@test.com');
    cy.get('#contact-form-message').click();
    cy.get('#contact-form-message').type('some test message');
    cy.get('#contact-send-button').click();
    cy.get('#contact-message-status').should(
      'have.text',
      'Message sent successfully!'
    );
    cy.get('#contact-message-status').should('be.visible');
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
    cy.get('#About').click();
    cy.get(
      "#contact-about-route"
    ).click();
    cy.get('#contact-form-name').type('josh test');
    cy.get('#contact-form-email').type('josh@test.com');
    cy.get('#contact-form-message').click();
    cy.get('#contact-form-message').type('some test message');
    cy.get('#contact-send-button').click();
    cy.get('#contact-message-status').should(
      'have.text',
      'Failed to send message.'
    );
    cy.get('#contact-message-status').should('be.visible');
  });
});
