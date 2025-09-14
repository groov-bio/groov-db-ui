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
    cy.get('#home-page-header').should(
      'have.text',
      'Find your sensor'
    );
    cy.get('.Mui-selected').should('have.attr', 'tabindex', '0');
    cy.get('[tabindex="-1"]').click();
    cy.get('#ligand-search-input').should('be.visible');
    cy.get('#ligand-search-input-label').should('have.text', 'SMILES String');
    cy.get('#use-example-smiles').click();
    cy.get('#ligand-search-input').should('have.value', 'CC1=C(C(=CC(=C1)CCCC(C)C)O)C(C)');
    cy.get('#search-button').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#results-total').should('have.text', "Results (6)");
    cy.contains("2,5-Dialkylresorcinol").should('exist')
    cy.contains("Similarity Score: 65%").should("exist")
    cy.get('#regulators-count').should(
      'have.text',
      'Regulators: 215'
    );
    cy.get('#ligands-count').should(
      'have.text',
      'Unique ligands: 321'
    );
    cy.get('[data-testid="PersonIcon"]').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });
});
