describe('Add new sensor spec', () => {
  it('should display the add new sensor page', () => {
    cy.setupAdminAuth();
    cy.visit('http://localhost:3000/addSensor');

    // Comment to test PR build time

    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-tqt3xn > :nth-child(1) > .MuiTypography-root').should(
      'have.text',
      'Basic information:'
    );
    cy.get(
      '.css-1u21q56 > [style="width: 100%;"] > :nth-child(1) > .MuiTypography-root'
    ).should('have.text', 'Ligand');
    cy.get(':nth-child(1) > .MuiGrid-container > .MuiGrid-grid-xs-5').should(
      'be.visible'
    );
    cy.get(
      ':nth-child(2) > .MuiStepLabel-root > .MuiStepLabel-iconContainer > .MuiSvgIcon-root > .MuiStepIcon-text'
    ).should('have.text', '2');
    cy.get(
      ':nth-child(3) > .MuiStepLabel-root > .MuiStepLabel-iconContainer > .MuiSvgIcon-root > .MuiStepIcon-text'
    ).should('have.text', '3');
    cy.get('#\\:r0\\:').should('be.visible');
    cy.get('#\\:r1\\:').should('be.visible');
    cy.get('#\\:r2\\:').should('be.visible');
    cy.get('#mui-component-select-about\\.family').should('be.visible');
    cy.get('#mui-component-select-about\\.mechanism').should('be.visible');
    cy.get('#\\:r3\\:').should('be.visible');
    cy.get(
      ':nth-child(2) > .MuiStepLabel-root > .MuiStepLabel-labelContainer'
    ).click();
    cy.get('#\\:r4\\:-label').should('be.visible');
    cy.get('#\\:r5\\:').should('be.visible');
    cy.get('#\\:r6\\:-label').should('be.visible');
    cy.get(
      '.css-183ge5p-MuiFormControl-root > .MuiFormControl-root > .MuiFormLabel-root'
    ).should('be.visible');
    cy.get('#\\:r7\\:').should('be.visible');
    cy.get('.css-f9qfdi > .MuiFormControl-root > .MuiFormLabel-root').should(
      'be.visible'
    );
    cy.get('.css-3pe6xu > :nth-child(2)').click();
    cy.get(
      ':nth-child(4) > .MuiListItemButton-root > .MuiListItemText-root > .MuiTypography-root'
    ).should('be.visible');
    cy.get('#\\:r8\\:-label').should('be.visible');
    cy.get(
      ':nth-child(3) > .MuiStepLabel-root > .MuiStepLabel-labelContainer'
    ).click();
    cy.get('.MuiListItemText-root > .MuiTypography-root').should('be.visible');
    cy.get('#\\:rc\\:-label').should('be.visible');
    cy.get('#\\:rd\\:').should('be.visible');
    cy.get('#mui-component-select-operators\\.0\\.fig_type').should(
      'be.visible'
    );
    cy.get('#\\:re\\:-label').should('be.visible');
    cy.get('.css-f9qfdi > .MuiFormControl-root > .MuiFormLabel-root').should(
      'be.visible'
    );
    cy.get('.css-3pe6xu > :nth-child(2)').click();
    cy.get(
      ':nth-child(4) > .MuiListItemButton-root > .MuiListItemText-root > .MuiTypography-root'
    ).should('be.visible');
    cy.get('[data-testid="DeleteForeverIcon"] > path').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });

  it('should do form validations', () => {
    cy.setupAdminAuth();
    cy.visit('http://localhost:3000/addSensor');

    /* ==== Generated with Cypress Studio ==== */
    cy.get('#\\:r0\\:').click();
    cy.get(':nth-child(2) > .css-0').click();
    cy.get('#\\:r0\\:-helper-text').should('have.text', 'Alias is required');
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
