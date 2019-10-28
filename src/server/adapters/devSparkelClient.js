module.exports = {
    hentPerson: aktørId => {
        const response =
            aktørId === '10000000000001'
                ? { fornavn: 'Kong', etternavn: 'Harald', kjønn: 'mann' }
                : { fornavn: 'Dronning', etternavn: 'Sonja', kjønn: 'kvinne' };
        return Promise.resolve(response);
    }
};
