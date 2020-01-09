'use strict';

const isValid = sak => objectStructureMatches(validSak, sak);

const map = requestBody => {
    const { sak, saksbehandlerIdent } = requestBody;
    return {
        sakskompleksId: sak.id,
        aktørId: sak.aktørId,
        organisasjonsnummer: sak.organisasjonsnummer,
        maksdato: sak.maksdato,
        saksbehandler: saksbehandlerIdent,
        utbetalingslinjer: sak.utbetalingslinjer?.map(linje => ({
            fom: linje.fom,
            tom: linje.tom,
            grad: linje.grad ? linje.grad : 100,
            dagsats: linje.dagsats
        })),
        utbetalingsreferanse: 'helse-simulering'
    };
};

const objectStructureMatches = (expected, actual) => {
    let eq = true;
    for (const key in expected) {
        if (typeof expected[key] !== typeof actual[key]) {
            return false;
        }

        if (typeof expected[key] === 'object') {
            eq = eq && objectStructureMatches(expected[key], actual[key]);
        }

        if (Array.isArray(expected[key])) {
            eq = eq && arrayEquals(expected[key], actual[key]);
        }
    }

    return eq;
};

const arrayEquals = (expected, actual) => {
    for (const key in expected) {
        if (!objectStructureMatches(expected[key], actual[key])) {
            return false;
        }
    }
    return true;
};

const validSak = {
    sakskompleksId: '6541-4dcf',
    aktørId: '0123456789012',
    organisasjonsnummer: '123456789',
    utbetalingslinjer: [
        {
            fom: '2019-05-09',
            tom: '2019-05-24',
            dagsats: 1603
        }
    ],
    maksdato: '2019-05-27'
};

module.exports = {
    isValid,
    map
};
