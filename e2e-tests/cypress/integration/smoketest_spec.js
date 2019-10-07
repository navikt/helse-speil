describe('The Home Page', function() {
    beforeEach(() => {
        cy.visit('/');
    });

    it('loads and displays content', function() {
        cy.contains('NAV Sykepenger');
    });
});
