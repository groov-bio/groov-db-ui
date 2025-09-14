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
    cy.intercept('GET', "https://groov-api.com/all-sensors.json", {
      fixture: "all-sensors.json"
    }).as('all-sensors')
    cy.intercept('GET', 'https://groov-api.com/indexes/tetr.json', {
      fixture: 'tetrFamilyPages.json',
    }).as('tetr-search');
    cy.intercept('GET', 'https://groov-api.com/sensors/tetr/U2Y8G0.json', {
      fixture: 'tetrSensor.json',
    }).as('tetr-sensor');
    cy.intercept(
      'GET',
      'https://alphafold.ebi.ac.uk/files/AF-U2Y8G0-F1-model_v4.cif',
      { fixture: 'tetrAlphaFold.cif' }
    ).as('tetr-af');

    cy.visit('http://localhost:3000');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#Browse').click();
    cy.get('#database-link-TetR').click({force: true});
    cy.get('[data-id="U2Y8G0"] [data-field="uniprot"] a').click();
    cy.get('#sensor-page-tab-view-switch').click();
    cy.get('#sensor-about').should(
      'have.text',
      'Regulates the expression of the ecd operon responsible for the degradation of estradiol.'
    );
    cy.get("#sensor-metadata-family").should('have.text', "Family: TETR")
    cy.get("#metadata-table-data-Organism").should('have.text', "Caenibius tardaugens")
    cy.get("#sensor-ligands-tab").click()
    cy.get('#SMILEScanvas').should('have.id', 'SMILEScanvas');
    cy.get('#SMILEScanvas').should('be.visible');
    cy.get(
      "#sensor-ligand-name"
    ).should('have.text', 'Estradiol');
    cy.get(
      "#sensor-ligand-figure"
    ).should('have.text', 'Figure 12');
    cy.get(
      "#sensor-ligand-method"
    ).should('have.text', 'Synthetic regulation');
    cy.contains("AF-U2Y8G0-F1").should('exist')
    cy.contains("Predicted").should('exist')
    cy.get("#sensor-operators-tab").click()
    cy.contains(
      'Length208MANELKAAANPRRSPGRPRDASREKVILTETLALLGELGFAGLTVDAVVARAKVSKATIYRRWATKEELAIAAFDLLPLIEPVETGDIESEIIAYIDQYYGFLRTTPLSSVLPALVSEAMHNPTLAERLNEVVQRRRESGIAMIRRAITRGELPATTPPDIAHELIVGPMLQRSFFEPANFRREDFLVMVRVIVAGLKAVGKATSSAA'
    ).should('exist')
    cy.get('[data-field="sequence"]').should(
      'have.text',
      'SequenceAATAACAGTACCAATAGTATCGAAAGT'
    );
    cy.get('[data-field="reference"] > a').should(
      'have.attr',
      'href',
      'https://doi.org/10.3390/genes12121846'
    );
    cy.get('[data-field="method"]').should(
      'have.text',
      'MethodSynthetic regulation'
    );
    cy.get("#sensor-genomes-tab").click()
    cy.get('.konvajs-content > canvas').should('be.visible');
    cy.get(
      "#enzyme-chip > span"
    ).should('have.text', 'Enzyme');
    cy.get(
      "#transporter-chip"
    ).should('have.text', 'Transporter');
    cy.get('#regulator-chip').should(
      'have.text',
      'Regulator'
    );
    cy.get('#other-chip').should(
      'have.text',
      'Other'
    );
    cy.get('#alias-chip').should(
      'have.text',
      'EdcR'
    );
    /* ==== End Cypress Studio ==== */
  });
});
