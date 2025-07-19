import Search from '../../src/Components/Search';

let baseUrl = 'https://jnwztkllg1.execute-api.us-east-2.amazonaws.com/dev';

describe('Search', () => {
  //This function is run before each test below that starts with it
  beforeEach(() => {
    //Intercept is crucial if we have APIs involved
    //We want to 'stub' the API rather than actually call it in order to save resources and be consistent - this should be done for all APIs
    //We are testing the UI, not the API so it's best to stub
    //Intercept allows you to feed the UI a correct JSON file every time (just copy the real API response into a JSON file)
    //It also allows you to test errors from the UI be sending back a statusCode of 4XX
    cy.intercept('GET', `${baseUrl}/search`, (req) => {
      req.reply({
        statusCode: 200,
        fixture: 'baseSearchResponse.json',
        delay: 1000,
      });
    }).as('search');
  });

  //Tests that the component is mountable
  it('Mounts search', () => {
    cy.mount(<Search />);
  });

  //Look for the label element, check that it contains 'Loading...' and assert that's true
  it('Contains the correct placeholder text', () => {
    cy.mount(<Search />);
    cy.get('label').contains('Loading...').should('exist');
  });

  //Look for the label element, wait for the API, then check if it says 'Enter a ligand' and assert that's true
  it('Text should change once API returns', () => {
    cy.mount(<Search />);
    cy.wait('@search'); //Wait for intercept in beforeEach() to return
    cy.get('label').contains('Enter a ligand').should('exist');
  });

  //Check that the dropdown opens, type 'AraC' and the first result should contain 'AraC'
  it('First result should contain AraC', () => {
    cy.routerMount(<Search />);
    cy.wait('@search');
    cy.get('input').click().type('AraC');
    cy.get('[role="presentation"]').contains('AraC'); //MUI dropdowns hide in the '[role="presentation"]'
    //Go  into developer console, type this -> setTimeout(function(){debugger;}, 5000)
    //Open the dropdown and wait 5 seconds, this will allow you to inspect dropdowns once the above fires
  });
});
