'use strict';

const isValid = behandling => objectStructureMatches(validBehandling, behandling);

const map = behandling => {
    return {
        soknadId: behandling.originalSøknad.id,
        aktorId: behandling.originalSøknad.aktorId,
        vedtaksperioder: behandling.vedtak.perioder,
        maksDato: behandling.avklarteVerdier.maksdato.fastsattVerdi
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

const validBehandling = {
    originalSøknad: {
        id: 123,
        aktorId: '11111'
    },
    vedtak: {
        perioder: [
            {
                fom: '2019-05-09',
                tom: '2019-05-24',
                dagsats: 1603,
                grad: 100,
                fordeling: [
                    {
                        mottager: '999999999',
                        andel: 100
                    }
                ]
            }
        ]
    },
    avklarteVerdier: {
        maksdato: {
            fastsattVerdi: '2019-05-24'
        }
    }
};

module.exports = {
    isValid,
    map
};
