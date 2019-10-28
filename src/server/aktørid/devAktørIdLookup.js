const init = () => undefined;

const hentAktørId = ssn => Promise.resolve(ssn);

const hentFnr = async aktørId => {
    const fnr = aktørId === '10000000000001' ? '98765432100' : '12345678900';
    return Promise.resolve(fnr);
};

module.exports = {
    init,
    hentAktørId,
    hentFnr
};
