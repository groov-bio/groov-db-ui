describe('About page spec', () => {
  it('Ensures everything on the about page is visible', () => {
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
    cy.get('#about-header').should('be.visible');
    cy.get('#simon-url').should(
      'have.attr',
      'href',
      'https://simondoelsnitz.com'
    );
    cy.get('#contact-about-route').should('have.attr', 'href', '/about/contact');
    cy.get(
      '#cite-about-route'
    ).click();
    cy.get('#about-cite-header').should(
      'have.text',
      'Citing groovDB'
    );
    cy.get('#about-cite-other').should(
      'have.text',
      'Citing other tools'
    );
    cy.get(
      '#contributing-about-route'
    ).click();
    cy.get('#about-add-sensor').should('have.attr', 'href', 'https://www.groov.bio/addSensor/');
    cy.get('#contact-about-route').should(
      'have.attr',
      'href',
      '/about/contact'
    );
    cy.get(
      "#contact-about-route"
    ).click();
    cy.get('#about-contact-us-header').should(
      'have.text',
      'Contact Us'
    );
    cy.get('#contact-form-name').should('be.visible');
    cy.get('#contact-form-email').should('be.visible');
    cy.get('#contact-form-message').should('be.visible');
    cy.get('#contact-send-button').should('have.text', 'Send');
    cy.get(
      "#change-log-about-route"
    ).click();
    cy.get('#about-change-log-header').should('have.text', 'Change Log');
    cy.get('#improve-groov').should(
      'have.text',
      'We are always looking for ways to improve groovDB. If you have any suggestions, please contact us.'
    );
    cy.get(
      "#programmatic-access-about-route"
    ).click();
    cy.get('#about-programmatic-access-header').should(
      'have.text',
      'Programmatic access'
    );
    cy.get('#about-download-all-sensors').should(
      'have.text',
      'Download all sensors'
    );
    cy.get('#download-all-sensors-button').should(
      'be.enabled'
    );
    cy.get('#download-all-sensors-about').should(
      'have.text',
      'All sensor data can be downloaded as a single JSON file via the link above. As of May 2025, the file is 2.1 MB.'
    );
    cy.get('#swagger-page').should(
      'have.attr',
      'href',
      'https://api.groov.bio/swagger'
    );

    cy.get('#rest-api-about').should(
      'have.text',
      'Subsets of the database can be accessed via our REST API. Full documentation on API endpoints and path parameters are detailed in the Swagger page linked above. The main endpoints are /search, for text-based queries, /getPages, to retrieve all sensors within a specific family, and /getSensor, to retrieve all information on a specific sensor entry.'
    );

    /* ==== End Cypress Studio ==== */
  });
});
