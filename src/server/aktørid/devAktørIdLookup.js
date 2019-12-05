const init = () => undefined;

const hentAktørId = fnr => Promise.resolve(fnr);

const hentFnr = async aktørId => {
    const fnr = aktørId === '1000000009871' ? '19011901901' : '12045632100';
    return Promise.resolve(fnr);
};

module.exports = {
    init,
    hentAktørId,
    hentFnr
};
