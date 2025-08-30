describe('Add new sensor spec', () => {
  it('should display the add new sensor page', () => {
    cy.setupAdminAuth();
    cy.visit('http://localhost:3000/addSensor');

    // Comment to test PR build time

    /* ==== Generated with Cypress Studio ==== */
    cy.get('#new-sensor-basic-info').should(
      'have.text',
      'Basic information:'
    );
    cy.get('#new-sensor-about-alias').should('be.visible');
    cy.get('#new-sensor-about-accession').should('be.visible');
    cy.get('#new-sensor-about-uniprot').should('be.visible');
    cy.get('#mui-component-select-about\\.family').should('be.visible');
    cy.get('#mui-component-select-about\\.mechanism').should('be.visible');
    cy.get('#new-sensor-about-about').should('be.visible');
    cy.get(
      ':nth-child(2) > .MuiStepLabel-root > .MuiStepLabel-labelContainer'
    ).click();
    cy.get('#new-sensor-ligand-name').should('be.visible');
    cy.get('#new-sensor-ligand-smiles').should('be.visible');
    cy.get('#new-sensor-ligand-doi').should('be.visible');
    cy.get('#new-sensor-ligand-fig').should('be.visible');
    cy.get(
      ':nth-child(3) > .MuiStepLabel-root > .MuiStepLabel-labelContainer'
    ).click();
    cy.get('#new-sensor-operator-sequence').should('be.visible');
    cy.get('#new-sensor-operator-doi').should('be.visible');
    cy.get('#new-sensor-operator-fig').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });

  it('should do form validations', () => {
    cy.setupAdminAuth();
    cy.visit('http://localhost:3000/addSensor');

    /* ==== Generated with Cypress Studio ==== */
    cy.get(
      ':nth-child(3) > .MuiStepLabel-root > .MuiStepLabel-labelContainer'
    ).click();
    cy.get("#add-new-sensor-submit").click()
    cy.get(
      ':nth-child(1) > .MuiStepLabel-root > .MuiStepLabel-labelContainer'
    ).click();
    cy.get('#new-sensor-about-alias-helper-text').should('have.text', 'Alias is required');
    cy.get(
      ':nth-child(1) > .MuiStepLabel-root > .MuiStepLabel-labelContainer > .MuiTypography-root'
    ).should('have.text', 'Missing data');
    cy.get(
      ':nth-child(2) > .MuiStepLabel-root > .MuiStepLabel-labelContainer > .MuiTypography-root'
    ).should('have.text', 'Missing data');
    cy.get(
      ':nth-child(3) > .MuiStepLabel-root > .MuiStepLabel-labelContainer > .MuiTypography-root'
    ).should('have.text', 'Missing data');
    /* ==== End Cypress Studio ==== */
  });
});
