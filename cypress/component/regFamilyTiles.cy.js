import RegFamilyTiles from '../../src/Components/RegFamilyTiles';

describe('RegFamilyTiles', () => {
  it('Mounts RegFamilyTiles', () => {
    cy.viewport(1920, 1080);
    cy.routerMount(<RegFamilyTiles />);
  });
});
