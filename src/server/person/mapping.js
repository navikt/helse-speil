'use strict';

const fromBehandlingSummary = behandlingSummary => {
    const { vurderingstidspunkt, fom, tom, aktorId, behandlingsId } = behandlingSummary;
    return {
        originalSøknad: {
            aktorId,
            fom,
            tom
        },
        behandlingsId,
        vurderingstidspunkt
    };
};

module.exports = {
    fromBehandlingSummary
};
