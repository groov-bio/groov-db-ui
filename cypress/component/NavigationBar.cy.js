import NavigationBar from '../../src/Components/NavigationBar';

// Another one

describe('NavBar', () => {
  //Check the component can be mounted
  it('Mounts Navigation', () => {
    cy.viewport(1920, 1080); //Start with 1080p size
    cy.routerMount(<NavigationBar />); //Use routerMount to render <Link> elements
    //Anything that users react-router-dom should be mounted with routerMount
    //Custom cy commands can be added to cypress/support/component.js
  });

  it('[DESKTOP] Contains the basic items in navigation', () => {
    cy.viewport(1920, 1080);
    cy.routerMount(<NavigationBar />);

    //Check for all three buttons
    cy.get('nav').contains('Home').should('exist');
    cy.get('nav').contains('Database').should('exist');
    cy.get('nav').contains('About').should('exist');
  });

  it('[DESKTOP] Should display about dropdown', () => {
    cy.viewport(1920, 1080);
    cy.routerMount(<NavigationBar />);

    //Click dropdown for about
    cy.get('#fade-button').click();

    //Check all dropdown options exist and that their text is correct
    cy.get('[href="/aboutGroovDB"]')
      .should('exist')
      .children()
      .should('contain', 'About GroovDB');

    cy.get('[href="/background"]')
      .should('exist')
      .children()
      .should('contain', 'Background');

    cy.get('[href="/howToUse"]')
      .should('exist')
      .children()
      .should('contain', 'How to Use');

    cy.get('[href="/cite"]')
      .should('exist')
      .children()
      .should('contain', 'How to Cite');

    cy.get('[href="/contact"]')
      .should('exist')
      .children()
      .should('contain', 'Contact/Contribute');
  });

  //Check the options but this time, using a 500x500 screen (default size) for mobile
  it('[MOBILE] Contains the basic items in navigation', () => {
    cy.routerMount(<NavigationBar />);

    cy.get('[aria-label="open drawer"]').click();

    //Selecting the drawer by a newly added id 'drawer_list'
    cy.get('#drawer_list').should('contain', 'Home');
    cy.get('#drawer_list').should('contain', 'Database');
    cy.get('#drawer_list').should('contain', 'About');
  });

  it('[MOBILE] Should display about dropdown', () => {
    cy.routerMount(<NavigationBar />);

    cy.get('[aria-label="open drawer"]').click();

    //TODO - figure out why force: true is required for this to actually work
    cy.get('#fade-button').click({ force: true });

    //Check all dropdown options exist and that their text is correct
    cy.get('[href="/aboutGroovDB"]')
      .should('exist')
      .children()
      .should('contain', 'About GroovDB');

    cy.get('[href="/background"]')
      .should('exist')
      .children()
      .should('contain', 'Background');

    cy.get('[href="/howToUse"]')
      .should('exist')
      .children()
      .should('contain', 'How to Use');

    cy.get('[href="/cite"]')
      .should('exist')
      .children()
      .should('contain', 'How to Cite');

    cy.get('[href="/contact"]')
      .should('exist')
      .children()
      .should('contain', 'Contact/Contribute');
  });
});
