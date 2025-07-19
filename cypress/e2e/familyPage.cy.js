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
    cy.intercept('GET', 'https://groov-api.com/indexes/lysr.json', {
      fixture: 'lysrFamilyPages.json',
    }).as('lysr-search');

    cy.visit('http://localhost:3000');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiToolbar-root > .css-130f8nx > :nth-child(1)').click();
    cy.get('.MuiToolbar-root > .css-130f8nx > :nth-child(1) > a').click();
    cy.get(':nth-child(2) > a > .MuiBox-root').click();
    cy.get('[data-id="0"] > .MuiDataGrid-cell--withRenderer > a').should(
      'have.attr',
      'href',
      '/database/LysR/AtzR'
    );
    cy.get('.MuiGrid-direction-xs-column').click();
    cy.get('[data-testid="KeyboardArrowRightIcon"]').click();
    cy.get(
      '.MuiDataGrid-row--lastVisible > [data-field="ligand"] > .MuiDataGrid-cellContent'
    ).should('be.visible');
    cy.get('.MuiGrid-container > .MuiGrid-root > .MuiTypography-root').should(
      'be.visible'
    );
    /* ==== End Cypress Studio ==== */
  });
});
