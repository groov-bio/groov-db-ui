describe('Admin page spec', () => {
  it('should display the admin page', () => {
    // Mock common API calls that components make on mount
    cy.intercept('GET', 'https://groov-api.com/index.json', {
      fixture: 'baseSearchResponse.json',
    }).as('search');
    cy.intercept('POST', 'https://www.google-analytics.com/g/collect', {
      statusCode: 200,
      body: {},
    }).as('googleAnalytics');

    // Mock admin-specific API calls
    cy.intercept('GET', 'https://api.groov.bio/getAllTempSensors', {
      fixture: 'getAllTempSensors.json',
    }).as('getAllTempSensors');
    cy.intercept('GET', 'https://api.groov.bio/getAllProcessedTemp', {
      fixture: 'getAllProcessedTemp.json',
    }).as('getAllProcessedTemp');

    cy.setupAdminAuth();
    cy.visit('http://localhost:3000/admin/');

    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiDataGrid-row > [data-field="family"]').should('have.text', 'TETR');
    cy.get('.css-1yjvs5a > .MuiBox-root > .MuiDataGrid-root > .MuiDataGrid-mainContent > .MuiDataGrid-main > .MuiDataGrid-virtualScroller > .MuiDataGrid-virtualScrollerContent > .MuiDataGrid-virtualScrollerRenderZone > .MuiDataGrid-row > [data-field="alias"]').should('have.text', 'AvaR1');
    cy.get('.MuiDataGrid-row > [data-field="uniProtID"]').should('have.text', 'Q82H41');
    cy.get('.MuiDataGrid-row--firstVisible > [data-field="alias"] > .MuiButtonBase-root').should('have.text', 'A0A0D5YGI2');
    cy.get('.MuiDataGrid-row--lastVisible > [data-field="alias"] > .MuiButtonBase-root').should('have.text', 'Q82H41');
    /* ==== End Cypress Studio ==== */
  });

  it('Should display the temp sensor', () => {
    // Mock common API calls that components make on mount
    cy.intercept('GET', 'https://groov-api.com/index.json', {
      fixture: 'baseSearchResponse.json',
    }).as('search');
    cy.intercept('POST', 'https://www.google-analytics.com/g/collect', {
      statusCode: 200,
      body: {},
    }).as('googleAnalytics');

    // Mock admin-specific API calls
    cy.intercept('GET', 'https://api.groov.bio/getAllTempSensors', {
      fixture: 'getAllTempSensors.json',
    }).as('getAllTempSensors');
    cy.intercept('GET', 'https://api.groov.bio/getAllProcessedTemp', {
      fixture: 'getAllProcessedTemp.json',
    }).as('getAllProcessedTemp');
    cy.intercept(
      'GET',
      'https://api.groov.bio//getProcessedTemp?family=TETR&sensorID=Q82H41',
      { fixture: 'getProcessedTemp.json' }
    ).as('getProcessedTemp');

    // Mock sensor data API calls for when viewing a sensor (SensorPage component)
    cy.intercept('GET', 'https://groov-api.com/sensors/tetr/Q82H41.json', {
      fixture: 'getProcessedTemp.json',
    }).as('sensorData');

    // Mock additional admin action APIs that might be called
    cy.intercept('POST', 'https://api.groov.bio/addNewSensor', {
      statusCode: 202,
      body: {},
    }).as('addNewSensor');
    cy.intercept('POST', 'https://api.groov.bio/deleteTemp', {
      statusCode: 200,
      body: {},
    }).as('deleteTemp');
    cy.intercept('POST', 'https://api.groov.bio/approveProcessedSensor', {
      statusCode: 200,
      body: {},
    }).as('approveProcessedSensor');
    cy.intercept('POST', 'https://api.groov.bio/rejectProcessedSensor', {
      statusCode: 200,
      body: {},
    }).as('rejectProcessedSensor');

    cy.setupAdminAuth();
    cy.visit('http://localhost:3000/admin/');

    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-field="view"] > .MuiButtonBase-root').click();
    cy.get('.MuiTypography-h3').should('have.text', 'AvaR1');
    cy.get('#sensor-metadata-family > .MuiChip-label').should('have.text', 'Family: TETR');
    cy.get('#sensor-page-tab-view-switch').click();
    cy.get(':nth-child(1) > .MuiGrid-container > .css-15vo6f1-MuiGrid-root > .MuiTypography-root').should('have.text', 'Apo-repressor');
    cy.get('#sensor-ligands-tab').click();
    cy.get('.css-t5dqux > [style="width: 100%;"]').click();
    cy.get('#sensor-ligand-name').should('have.text', 'Avenolide');
    cy.get('.css-i9gxme > [style="width: 100%;"] > .css-yqiqnf-MuiGrid-root > .MuiPaper-root > .MuiTypography-root').should('have.text', 'AF-Q82H41-F1');
    cy.get('#sensor-operators-tab').click();
    cy.get(':nth-child(1) > .MuiCardContent-root > .css-i9gxme > [style="width: 100%;"] > .MuiGrid-grid-xs-12 > .MuiPaper-root').should('have.text', 'Length234MARQERAIRTRQTILVAAAEVFDEVGYEAATISDVLKRSGVTKGALYFHFTSKQELAQAVLAEQVASLPRVPEQELKLQQSLDEALLLAHLLREGTGDPIVQGSVRLTVDQGSPRDHLNRRVPMQAWTEHTQSLFEEARAKGEILPHADVEALAKLFVGAFTGVQVLSRIMTGRADLAERVADLYRHLMPSFAMPGILVRLDFSPERGSRVYEAAMKQRESAAASTTDAARTLE');
    cy.get('.MuiDataGrid-row > [data-field="sequence"]').should('have.text', 'GCAAGATACGTACTAGTACGTATCTTGC');
    cy.get('#sensor-genomes-tab').click();
    cy.get('#sensor-refs-tab').click();
    cy.get('.MuiGrid-container > :nth-child(1) > .MuiTypography-root').should('have.text', 'Regulation TypeUniprot IDRefSeq IDKEGG IDOrganismProtein Length1. Biochemical basis for the regulation of biosynthesis of antiparasitics by bacterial hormones');
    /* ==== End Cypress Studio ==== */
  });
});
