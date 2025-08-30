describe('Family Page', () => {
  it('should display the family page', () => {
    // Mock common API calls that components make on mount
    cy.intercept('GET', 'https://groov-api.com/index.json', {
      fixture: 'baseSearchResponse.json',
    }).as('search');
    cy.intercept('POST', 'https://www.google-analytics.com/g/collect', {
      statusCode: 200,
      body: {},
    }).as('googleAnalytics');

    // Mock family-specific API call
    cy.intercept('GET', 'https://groov-api.com/indexes/tetr.json', {
      fixture: 'tetrFamilyPages.json',
    }).as('tetr-search');

    cy.visit('http://localhost:3000');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#Browse').click();
    cy.get('#database-link-TetR').click();
    cy.get('[data-id="U2Y8G0"] [data-field="uniprot"] a').should(
      'have.attr',
      'href',
      '/entry/TetR/U2Y8G0'
    );
    /* ==== End Cypress Studio ==== */
  });
});
