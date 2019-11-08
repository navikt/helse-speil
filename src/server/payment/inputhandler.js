'use strict';

const map = (sak, saksbehandlerIdent) => {
    return {
        '@behov': 'Utbetaling',
        sakskompleksId: sak.id,
        aktørId: sak.aktørId,
        organisasjonsnummer: sak.organisasjonsnummer,
        maksdato: sak.maksdato,
        saksbehandler: saksbehandlerIdent,
        utbetalingslinjer: sak.utbetalingslinjer.map(linje => ({
            fom: linje.fom,
            tom: linje.tom,
            grad: linje.grad ? linje.grad : 100,
            dagsats: linje.dagsats
        }))
    };
};

module.exports = {
    map
};
