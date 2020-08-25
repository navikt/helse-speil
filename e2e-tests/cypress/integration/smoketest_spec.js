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

    it('kan navigere til sykmeldingsperiode', function () {
        cy.get('.lenke-skjult:first');
        cy.get('.NavigationButtons').should('be.visible');
    });

    it('kan navigere til vilkår', function () {
        cy.get('.lenke-skjult:first').click();
        cy.get('#nav-link-vilkår').click();
        cy.get('.NavigationButtons').should('be.visible');
    });

    it('kan navigere til inntektskilder', function () {
        cy.get('.lenke-skjult:first').click();
        cy.get('#nav-link-inntektskilder').click();
        cy.get('.NavigationButtons').should('be.visible');
    });

    it('kan navigere til sykepengegrunnlag', function () {
        cy.get('.lenke-skjult:first').click();
        cy.get('#nav-link-sykepengegrunnlag').click();
        cy.get('.NavigationButtons').should('be.visible');
    });

    it('kan navigere til utbetalingsoversikt', function () {
        cy.get('.lenke-skjult:first').click();
        cy.get('#nav-link-utbetaling').click();
        cy.get('.NavigationButtons').should('be.visible');
    });

    it('kan navigere til oppsummering', function () {
        cy.get('.lenke-skjult:first').click();
        cy.get('#nav-link-oppsummering').click();
        cy.get('.NavigationButtons').should('be.visible');
    });
});
