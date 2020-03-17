describe('Oversiktssiden', function() {
    beforeEach(() => {
        cy.visit('/');
    });

    it('rendres', function() {
        cy.contains('NAV Sykepenger');
    });

    it('viser navnet på innlogget bruker', function() {
        cy.contains('S. A. Ksbehandler');
    });

    it('kan navigere til sykmeldingsperiode', function() {
        cy.contains('Dronning Sonja').click();
        cy.get('.NavigationButtons').should('be.visible');
    });

    it('kan navigere til vilkår', function() {
        cy.contains('Dronning Sonja').click();
        cy.get('#nav-link-vilkår').click();
        cy.get('.NavigationButtons').should('be.visible');
    });

    it('kan navigere til inntektskilder', function() {
        cy.contains('Dronning Sonja').click();
        cy.get('#nav-link-inntektskilder').click();
        cy.get('.NavigationButtons').should('be.visible');
    });

    it('kan navigere til sykepengegrunnlag', function() {
        cy.contains('Dronning Sonja').click();
        cy.get('#nav-link-sykepengegrunnlag').click();
        cy.get('.NavigationButtons').should('be.visible');
    });

    it('kan navigere til utbetalingsoversikt', function() {
        cy.contains('Dronning Sonja').click();
        cy.get('#nav-link-utbetaling').click();
        cy.get('.NavigationButtons').should('be.visible');
    });

    it('kan navigere til oppsummering', function() {
        cy.contains('Dronning Sonja').click();
        cy.get('#nav-link-oppsummering').click();
        cy.get('.NavigationButtons').should('be.visible');
    });
});
