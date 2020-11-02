describe('Oversiktssiden', function () {
    beforeEach(() => {
        cy.visit('/').wait(200);
    });

    it('rendres', function () {
        cy.contains('NAV Sykepenger');
    });

    it('viser navnet på innlogget bruker', function () {
        cy.contains('S. A. Ksbehandler');
    });
});
