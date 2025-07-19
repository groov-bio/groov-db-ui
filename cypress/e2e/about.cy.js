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
    cy.get(':nth-child(3) > a').click();
    cy.get('.css-1p277o4-MuiTypography-root').should('be.visible');
    cy.get('.css-rx71jq > .MuiBox-root > :nth-child(2) > a').should(
      'have.attr',
      'href',
      'https://simondoelsnitz.com'
    );
    cy.get(':nth-child(4) > a').should('have.attr', 'href', 'contact');
    cy.get(
      '[href="/about/cite"] > .MuiListItemText-root > .MuiTypography-root'
    ).click();
    cy.get('.css-1p277o4-MuiTypography-root').should(
      'have.text',
      'Citing groovDB'
    );
    cy.get('.css-nxwiv9-MuiTypography-root').should(
      'have.text',
      'Citing other tools'
    );
    cy.get(
      '[href="/about/contributing"] > .MuiListItemText-root > .MuiTypography-root'
    ).click();
    cy.get('[sx="[object Object]"]').should('have.attr', 'href', '/addSensor');
    cy.get('span.css-1vzvt9i-MuiTypography-root > a').should(
      'have.attr',
      'href',
      'https://groov.bio/about/contact'
    );
    cy.get(
      '[href="/about/contact"] > .MuiListItemText-root > .MuiTypography-root'
    ).click();
    cy.get('.css-1isinvg > .MuiTypography-root').should(
      'have.text',
      'Contact Us'
    );
    cy.get('#\\:r2\\:').should('be.visible');
    cy.get('#\\:r3\\:').should('be.visible');
    cy.get('#\\:r4\\:').should('be.visible');
    cy.get('form > .MuiButtonBase-root').should('have.text', 'Send');
    cy.get(
      '[href="/about/change-log"] > .MuiListItemText-root > .MuiTypography-root'
    ).click();
    cy.get('.MuiTypography-gutterBottom').should('have.text', 'Change Log');
    cy.get('.css-1vzvt9i-MuiTypography-root').should(
      'have.text',
      'We are always looking for ways to improve groovDB. If you have any suggestions, please contact us.'
    );
    cy.get(
      '[href="/about/programmatic-access"] > .MuiListItemText-root > .MuiTypography-root'
    ).click();
    cy.get('.css-1p277o4-MuiTypography-root').should(
      'have.text',
      'Programmatic access'
    );
    cy.get('.css-rx71jq > .MuiBox-root > .MuiButtonBase-root').should(
      'have.text',
      'Download All Sensors'
    );
    cy.get('.css-rx71jq > .MuiBox-root > .MuiButtonBase-root').should(
      'be.enabled'
    );
    cy.get('.css-6hbkvk-MuiTypography-root').should(
      'have.text',
      'All sensor data can be downloaded as a single JSON file via the link above. As of May 2025, the file is 2.1 MB.'
    );
    cy.get('.MuiBox-root > a').should(
      'have.attr',
      'href',
      'https://api.groov.bio/swagger'
    );

    cy.get('.css-1vzvt9i-MuiTypography-root').should(
      'have.text',
      'Subsets of the database can be accessed via our REST API. Full documentation on API endpoints and path parameters are detailed in the Swagger page linked above. The main endpoints are /search, for text-based queries, /getPages, to retrieve all sensors within a specific family, and /getSensor, to retrieve all information on a specific sensor entry.'
    );

    /* ==== End Cypress Studio ==== */
  });
});
