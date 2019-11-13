const init = () => undefined;

const hentAktørId = ssn => Promise.resolve(ssn);

const hentFnr = async aktørId => {
    return Promise.resolve('12045632100');
};

module.exports = {
    init,
    hentAktørId,
    hentFnr
};
