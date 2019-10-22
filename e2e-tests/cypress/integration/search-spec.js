describe('Search for cases for a person', function() {
    beforeEach(() => {
        cy.visit('/');

        cy.get('#root > header > div.search > div > input[type=text]')
            .type('12345')
            .type('{enter}');

        cy.get(
            'body > div.ReactModalPortal > div > div > section > div > ul > li:nth-child(1) > button'
        ).click();
    });

    it('sets the active tab to "sykdomsvilkår"', function() {
        cy.get('#nav-link-sykdomsvilkår').should('have.class', 'active');
    });

    it('shows the person bar', function() {
        cy.get('div.PersonBar').should('be.visible');
    });
});
