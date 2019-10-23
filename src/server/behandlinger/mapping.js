'use strict';

const sykdomstidslinje = person =>
    person.arbeidsgivere[0].saker[0].sykdomstidslinje.map(dag => ({
        date: dag.dato,
        type: dag.type
    }));

const person = person => {
    return {
        behandlingsId: person.arbeidsgivere[0].saker[0].id,
        sykdomstidslinje: sykdomstidslinje(person)
    };
};

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
    person,
    fromBehandlingSummary
};
