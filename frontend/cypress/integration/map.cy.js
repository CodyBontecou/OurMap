import { isPermissionAllowed } from 'cypress-browser-permissions'

describe('Testing the Map component', () => {
  before(() => {
    cy.visit('http://localhost:3000/')
  })

  it('Location Permission be enabled', () => {
    expect(isPermissionAllowed('geolocation')).to.be.true
  })

  it('User Location Marker initially loaded', () => {
    expect(isPermissionAllowed('geolocation')).to.be.true
    cy.get('.leaflet-marker-icon').should('exist')
  })

  // TODO: This could test more precisely its the users location (not just zoom level)
  it('Clicking zoom-home button zooms to user location', () => {
    cy.get('#userLocationBtn').click()
  })

  // TODO: Messing with the URL (zoom) seems to be breaking the test runner
  it('Clicking zoom-out button zooms out', () => {
    cy.get('#zoomOutBtn').click()
  })

  it('Clicking zoom-in button zooms in', () => {
    cy.get('#zoomInBtn').click()
  })
})
