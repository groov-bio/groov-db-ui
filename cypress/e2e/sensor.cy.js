describe('Sensor Page', () => {
  it('should display the sensor page', () => {
    // Mock common API calls that components make on mount
    cy.intercept('GET', 'https://groov-api.com/index.json', {
      fixture: 'baseSearchResponse.json',
    }).as('search');
    cy.intercept('POST', 'https://www.google-analytics.com/g/collect', {
      statusCode: 200,
      body: {},
    }).as('googleAnalytics');

    // Mock sensor-specific API calls
    cy.intercept('GET', 'https://groov-api.com/indexes/lysr.json', {
      fixture: 'lysrFamilyPages.json',
    }).as('lysr-search');
    cy.intercept('GET', 'https://groov-api.com/sensors/lysr/Q8DTU8.json', {
      fixture: 'metrSensor.json',
    }).as('metr-sensor');
    cy.intercept(
      'GET',
      'https://alphafold.ebi.ac.uk/files/AF-Q8DTU8-F1-model_v4.cif',
      { fixture: 'metrAlphaFold.cif' }
    ).as('metr-af');

    cy.visit('http://localhost:3000');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiToolbar-root > .css-130f8nx > :nth-child(1) > a').click();
    cy.get(':nth-child(2) > a > .MuiBox-root').click();
    cy.get('[data-id="2"] > .MuiDataGrid-cell--withRenderer > a').click();
    cy.get('.css-18h88cm-MuiGrid-root > .MuiTypography-root').should(
      'have.text',
      'Activates the expression of genes responsible for methionine biosynthesis (MetEF and Smu.1487) and uptake (AtmBDE) in the presence of l-homocysteine'
    );
    cy.get(
      ':nth-child(3) > .MuiGrid-container > .MuiGrid-grid-xs-5 > .MuiTypography-inherit > .MuiTypography-root'
    ).should('be.visible');
    cy.get(
      ':nth-child(5) > .MuiGrid-container > .MuiGrid-grid-xs-5 > .MuiTypography-inherit > .MuiTypography-root'
    ).should('be.visible');
    cy.get(
      ':nth-child(2) > .MuiGrid-container > .MuiGrid-grid-xs-5 > .MuiTypography-inherit > .MuiTypography-root'
    ).should('have.text', 'Q8DTU8');
    cy.get(
      ':nth-child(4) > .MuiGrid-container > .MuiGrid-grid-xs-5 > .MuiTypography-inherit > .MuiTypography-root'
    ).should('have.text', 'smu:SMU_1225');
    cy.get('#SMILEScanvas').should('have.id', 'SMILEScanvas');
    cy.get('#SMILEScanvas').should('be.visible');
    cy.get(
      '.css-t5dqux > [style="width: 100%;"] > :nth-child(2) > .MuiPaper-root > .MuiTypography-root'
    ).should('have.text', 'L-Homocysteine');
    cy.get(
      '.css-t5dqux > [style="width: 100%;"] > :nth-child(4) > .MuiGrid-container > .MuiGrid-grid-xs-6 > .MuiTypography-inherit > .MuiTypography-root'
    ).should('have.text', 'Figure 7');
    cy.get(
      ':nth-child(5) > .MuiGrid-container > .MuiGrid-grid-xs-6 > .MuiTypography-inherit > .MuiTypography-root'
    ).should('have.text', 'EMSA');
    cy.get('.msp-viewport-host3d > canvas').should('be.visible');
    cy.get(
      '.MuiGrid-grid-xs-10 > .MuiBox-root > [style="width: 100%;"] > :nth-child(2) > .MuiPaper-root > .MuiTypography-root'
    ).should('be.visible');
    cy.get(
      '.MuiGrid-grid-xs-10 > .MuiBox-root > [style="width: 100%;"] > :nth-child(4) > .MuiGrid-container > .MuiGrid-grid-xs-6 > .MuiTypography-inherit > .MuiTypography-root'
    ).should('have.text', 'AF-Q8DTU8-F1');
    cy.get(
      '.MuiGrid-grid-xs-10 > .MuiBox-root > [style="width: 100%;"] > :nth-child(5) > .MuiGrid-container > .MuiGrid-grid-xs-6 > .MuiTypography-root'
    ).should('have.text', 'Predicted');
    cy.get(
      ':nth-child(10) > .css-i9gxme > [style="width: 100%;"] > .css-ox9j43-MuiGrid-root > .MuiPaper-root'
    ).should(
      'have.text',
      'Length302MRIQQLHYIIKIVETGSMNEAAKQLFITQPSLSNAVRDLEREMGIEIFIRNPKGITLTKDGVEFLSYARQVVEQTALLEERYKSQGHTRELFSVSAQHYAFVVNAFVSLLKETDMTRYELFLRETRTYEIIDDVKNFRSEIGVLFLNSYNHDVLTKMFDDNHLTYTSLFKAHPHIFVSKDNPLAKHQSVSLSDLEDFPYLSYDQGIHNSFYFSEEIMSQISHKKSIVVSDRATLFNLMIGLDGYTIATGILNSNLNGDNIVSIPLEVDDEIDIIYLKHEKANLSKMGEKFIDYLLEEVKFDK'
    );
    cy.get(
      ':nth-child(10) > .css-i9gxme > [style="width: 100%;"] > .css-ox9j43-MuiGrid-root > .MuiPaper-root'
    ).should('be.visible');
    cy.get('.css-1ffclnv-MuiGrid-root > svg').should('be.visible');
    cy.get('[data-field="sequence"] > .MuiDataGrid-cellContent').should(
      'have.text',
      'TATAGTTTAAAACTATA'
    );
    cy.get('.MuiDataGrid-cell--withRenderer > .MuiTypography-root').should(
      'have.attr',
      'href',
      'https://doi.org/10.1128/JB.00703-07'
    );
    cy.get('[data-field="method"] > .MuiDataGrid-cellContent').should(
      'be.visible'
    );
    cy.get('.konvajs-content > canvas').should('be.visible');
    cy.get(
      '.MuiGrid-spacing-xs-5 > .MuiGrid-container > :nth-child(2) > .MuiTypography-root'
    ).should('have.text', 'Enzyme');
    cy.get(
      '.MuiGrid-spacing-xs-5 > .MuiGrid-container > :nth-child(3) > .MuiTypography-root'
    ).should('have.text', 'Transporter');
    cy.get('.MuiGrid-container > :nth-child(4) > .MuiTypography-root').should(
      'have.text',
      'Regulator'
    );
    cy.get('.MuiGrid-container > :nth-child(5) > .MuiTypography-root').should(
      'have.text',
      'Other'
    );
    cy.get('.MuiGrid-container > :nth-child(6) > .MuiTypography-root').should(
      'have.text',
      'MetR'
    );
    cy.get('.css-5pv5pv-MuiGrid-root > .MuiTypography-root').should(
      'be.visible'
    );
    cy.get('.konvajs-content > canvas').click();
    /* ==== End Cypress Studio ==== */
  });
});
