describe('The Home Page', function() {
    beforeEach(() => {
        cy.visit('/');
    });

    it('renders the page', function() {
        cy.contains('NAV Sykepenger');
    });

    it('displays name of the logged in user', function() {
        cy.get('#user')
            .invoke('text')
            .should('eq', 'S. A. Ksbehandler');
    });
});
