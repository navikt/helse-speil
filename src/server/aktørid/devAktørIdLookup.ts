const init = () => undefined;

const hentAktørId = (fnr: string) => Promise.resolve(fnr);

const hentFnr = async (aktørId: string) => {
    const fnr = aktørId === '1000000009871' ? '19011901901' : '12045632100';
    return Promise.resolve(fnr);
};

export default { init, hentAktørId, hentFnr };
