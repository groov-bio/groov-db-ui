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
    cy.get('.MuiGrid-grid-xs-10 > .MuiTypography-root').should(
      'have.text',
      ' Administrator page'
    );
    cy.get('.MuiDataGrid-row > [data-field="family"]').should(
      'have.text',
      'TETR'
    );
    cy.get('.MuiDataGrid-row > [data-field="uniProtID"]').should(
      'have.text',
      'Q82H41'
    );
    cy.get('[data-id="0"] > [data-field="alias"]').should(
      'have.text',
      'A0A0D5YGI2'
    );
    cy.get(
      ':nth-child(5) > .MuiDataGrid-root > .MuiDataGrid-main > [style="overflow: visible; height: 0px; width: 0px;"] > .MuiDataGrid-virtualScroller > .MuiDataGrid-virtualScrollerContent > .MuiDataGrid-virtualScrollerRenderZone > .MuiDataGrid-row--lastVisible > [data-field="alias"]'
    ).should('have.text', 'Q82H41');
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
    cy.get(
      ':nth-child(3) > .MuiGrid-container > .MuiGrid-grid-xs-5 > .MuiTypography-inherit > .MuiTypography-root'
    ).should('have.text', 'WP_010985136.1');
    cy.get(
      ':nth-child(2) > .MuiGrid-container > .MuiGrid-grid-xs-5 > .MuiTypography-inherit > .MuiTypography-root'
    ).should('have.text', 'Q82H41');
    cy.get(
      ':nth-child(5) > .MuiGrid-container > .MuiGrid-grid-xs-5 > .MuiTypography-inherit > .MuiTypography-root'
    ).should('have.text', 'Streptomyces avermitilis');
    cy.get(
      '.MuiGrid-grid-xs-10 > .MuiBox-root > [style="width: 100%;"] > :nth-child(5) > .MuiGrid-container > .MuiGrid-grid-xs-6 > .MuiTypography-root'
    ).should('have.text', 'Predicted');
    cy.get(
      '.css-t5dqux > [style="width: 100%;"] > :nth-child(4) > .MuiGrid-container > .MuiGrid-grid-xs-6 > .MuiTypography-inherit > .MuiTypography-root'
    ).should('have.text', 'Figure 1E');
    cy.get(
      ':nth-child(10) > .css-i9gxme > [style="width: 100%;"] > .css-ox9j43-MuiGrid-root > .MuiPaper-root'
    ).should(
      'have.text',
      'Length234MARQERAIRTRQTILVAAAEVFDEVGYEAATISDVLKRSGVTKGALYFHFTSKQELAQAVLAEQVASLPRVPEQELKLQQSLDEALLLAHLLREGTGDPIVQGSVRLTVDQGSPRDHLNRRVPMQAWTEHTQSLFEEARAKGEILPHADVEALAKLFVGAFTGVQVLSRIMTGRADLAERVADLYRHLMPSFAMPGILVRLDFSPERGSRVYEAAMKQRESAAASTTDAARTLE'
    );
    cy.get('[data-field="sequence"] > .MuiDataGrid-cellContent').should(
      'have.text',
      'GCAAGATACGTACTAGTACGTATCTTGC'
    );
    cy.get('.MuiDataGrid-cell--withRenderer > .MuiTypography-root').should(
      'have.attr',
      'href',
      'https://doi.org/10.7554/eLife.57824'
    );
    cy.get(
      '.MuiPaper-root > .MuiGrid-container > :nth-child(1) > .MuiTypography-root'
    ).should(
      'have.text',
      '1. Biochemical basis for the regulation of biosynthesis of antiparasitics by bacterial hormones'
    );
    /* ==== End Cypress Studio ==== */
  });
});
