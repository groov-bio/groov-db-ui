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
    cy.get(':nth-child(2) > a').click();
    cy.get('[href="https://snowprint.groov.bio"] > img').should('be.visible');
    cy.get('[href="https://ligify.groov.bio"] > img').should('be.visible');
    cy.get('.css-11l5t4l-MuiGrid-root > .MuiTypography-root').should(
      'be.visible'
    );
    cy.get('.css-14k4ick-MuiGrid-root > .MuiTypography-root').should(
      'be.visible'
    );
    cy.get('.css-11l5t4l-MuiGrid-root > .MuiTypography-root > a').should(
      'have.attr',
      'href',
      'https://doi.org/10.1038/s42003-024-05849-8'
    );
    cy.get('.css-14k4ick-MuiGrid-root > .MuiTypography-root > a').should(
      'have.attr',
      'href',
      'https://www.biorxiv.org/content/10.1101/2024.02.20.581298v1'
    );
    /* ==== End Cypress Studio ==== */
  });
});
