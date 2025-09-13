describe('Tools spec', () => {
  it('should display the tools page', () => {
    // Mock common API calls that components make on mount
    cy.intercept('GET', 'https://groov-api.com/index.json', {
      fixture: 'baseSearchResponse.json',
    }).as('search');
    cy.intercept('POST', 'https://www.google-analytics.com/g/collect', {
      statusCode: 200,
      body: {},
    }).as('googleAnalytics');

    cy.visit('http://localhost:3000');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#Tools').click();
    cy.get('#snowprint-img').should('be.visible');
    cy.get('#ligify-img').should('be.visible');
    cy.get('#snowprint-desc').should(
      'be.visible'
    );
    cy.get('#ligify-desc').should(
      'be.visible'
    );
    cy.get('#snowprint-link').should(
      'have.attr',
      'href',
      'https://snowprint.groov.bio'
    );
    cy.get('#ligify-link').should(
      'have.attr',
      'href',
      'https://ligify.groov.bio'
    );
    /* ==== End Cypress Studio ==== */
  });
});
