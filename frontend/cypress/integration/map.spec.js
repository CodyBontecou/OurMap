import { isPermissionAllowed } from 'cypress-browser-permissions';

describe('Testing the Map component', () => {
  before(() => {
    cy.visit('http://localhost:3000/#3/39.81/-98.56')
  })

  it("Location Permission be enabled", () => {
    expect(isPermissionAllowed("geolocation")).to.be.true;
  })

  it("User Location Marker initially loaded", () => {
    expect(isPermissionAllowed("geolocation")).to.be.true;
    cy.get('.leaflet-marker-icon')
      .should('exist')
  })

  // TODO: This could test more precisely its the users location (not just zoom level)
  it('Clicking zoom-home button zooms to user location', () => {
    cy.get('.gin-control-zoom-home')
      .click()
    cy.url().should('contain', '/#16/');
  })

  // TODO: Messing with the URL (zoom) seems to be breaking the test runner
  it('Clicking zoom-out button zooms out', () => {
    cy.get('.gin-control-zoom-out')
      .click()
    cy.url().should('contain', '/#15/');
  })

  it('Clicking zoom-in button zooms in', () => {
    cy.get('.gin-control-zoom-in')
      .click()
    cy.url().should('contain', '/#16/');
  })

})
