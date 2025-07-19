describe('Home page spec', () => {
  it('should display the home page', () => {
    cy.intercept('GET', 'https://groov-api.com/index.json', {
      fixture: 'baseSearchResponse.json',
    }).as('search');
    cy.intercept('POST', 'https://api.groov.bio/ligandSearch', {
      fixture: 'ligandSearch.json',
    }).as('ligandSearch');
    cy.intercept('POST', 'https://www.google-analytics.com/g/collect', {
      statusCode: 200,
      body: {},
    }).as('googleAnalytics');
    cy.visit('http://localhost:3000');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-1tkasyh-MuiTypography-root').should(
      'have.text',
      'Find your sensor'
    );
    cy.get('.Mui-selected').should('have.attr', 'tabindex', '0');
    cy.get('[tabindex="-1"]').click();
    cy.get('#\\:r2\\:').should('be.visible');
    cy.get('#\\:r2\\:-label').should('have.text', 'SMILES String');
    cy.get('.css-efd5gz > .MuiButton-root').click();
    cy.get('#\\:r2\\:').should('have.value', 'CC1=C(C(=CC(=C1)CCCC(C)C)O)C(C)');
    cy.get('.MuiButton-contained').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiTypography-h6').should('be.visible');
    cy.get(
      '.css-1l5i5dx-MuiListItem-root > .MuiListItemText-root > .MuiTypography-body1'
    ).should('have.text', '2,5-Dialkylresorcinol');
    cy.get(
      '.css-1l5i5dx-MuiListItem-root > .MuiListItemText-root > .MuiListItemText-secondary > .css-5qpaaa-MuiTypography-root'
    ).should('have.text', 'Similarity Score: 65%');
    cy.get('.css-fvtvz4-MuiGrid-root > :nth-child(1)').should(
      'have.text',
      'Regulators: 214'
    );
    cy.get('.css-fvtvz4-MuiGrid-root > :nth-child(2)').should(
      'have.text',
      'Unique ligands: 321'
    );
    cy.get('[data-testid="PersonIcon"]').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });
});
