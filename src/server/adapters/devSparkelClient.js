module.exports = {
    hentPerson: aktørId => {
        const response =
            aktørId === '10000000000001'
                ? { fornavn: 'Kong', etternavn: 'Harald', kjønn: 'mann', fdato: '1937-02-21' }
                : { fornavn: 'Dronning', etternavn: 'Sonja', kjønn: 'kvinne', fdato: '1937-07-04' };
        return Promise.resolve(response);
    }
};
