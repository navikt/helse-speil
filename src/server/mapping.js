'use strict';

const datecalc = require('./datecalc');

const inngangsvilkår = behandling => {
    const medlemskap = {
        bostedsland: behandling.faktagrunnlag.tps.bostedland
    };

    const opptjening = {
        førsteSykdomsdag: toDate(
            behandling.avklarteVerdier.opptjeningstid.grunnlag.førsteSykdomsdag
        ),
        antallDager: behandling.avklarteVerdier.opptjeningstid.fastsattVerdi,
        // kun 1 arbeidsforhold i MVP
        startdato:
            behandling.avklarteVerdier.opptjeningstid.grunnlag.arbeidsforhold
                .length !== 0
                ? toDate(
                      behandling.avklarteVerdier.opptjeningstid.grunnlag
                          .arbeidsforhold.grunnlag[0].startdato
                  )
                : null,
        sluttdato:
            behandling.avklarteVerdier.opptjeningstid.grunnlag.arbeidsforhold
                .length !== 0
                ? toDate(
                      behandling.avklarteVerdier.opptjeningstid.grunnlag
                          .arbeidsforhold.grunnlag[0].sluttdato
                  )
                : null
    };

    const inntekt = {
        beløp:
            behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi
                .sykepengegrunnlagNårTrygdenYter.fastsattVerdi
    };

    const sendtNav = toDate(behandling.originalSøknad.sendtNav);
    const sisteSykdomsdag = newestTom(
        behandling.originalSøknad.soknadsperioder
    );
    const søknadsfrist = {
        sendtNav: sendtNav,
        sisteSykdomsdag: sisteSykdomsdag,
        innen3Mnd: datecalc.isWithin3Months(sisteSykdomsdag, sendtNav)
    };

    const dagerIgjen = {
        førsteFraværsdag: toDate(
            behandling.avklarteVerdier.maksdato.grunnlag.førsteFraværsdag
        ),
        førsteSykepengedag: toDate(
            behandling.avklarteVerdier.maksdato.grunnlag.førsteSykepengedag
        ),
        alder: behandling.avklarteVerdier.maksdato.grunnlag.personensAlder,
        yrkesstatus: behandling.avklarteVerdier.maksdato.grunnlag.yrkesstatus,
        maxDato: toDate(behandling.avklarteVerdier.maksdato.fastsattVerdi),
        tidligerePerioder:
            behandling.avklarteVerdier.maksdato.grunnlag.tidligerePerioder
    };

    return {
        medlemskap: medlemskap,
        opptjening: opptjening,
        inntekt: inntekt,
        søknadsfrist: søknadsfrist,
        dagerIgjen: dagerIgjen
    };
};

const originalSøknad = behandling => ({
    arbeidsgiver: behandling.originalSøknad.arbeidsgiver,
    aktorId: behandling.originalSøknad.aktorId,
    soknadsperioder: behandling.originalSøknad.soknadsperioder,
    fom: toDate(behandling.originalSøknad.fom),
    tom: toDate(behandling.originalSøknad.tom)
});

const alle = behandling => ({
    inngangsvilkår: inngangsvilkår(behandling),
    originalSøknad: originalSøknad(behandling)
});

const toDate = dateString => {
    return dateString ? new Date(dateString) : null;
};

const newestTom = objs => {
    return objs.reduce((max, d) => {
        const date = toDate(d.tom);
        return date > max ? date : max;
    }, toDate(objs[0].tom));
};

module.exports = {
    inngangsvilkår: inngangsvilkår,
    originalSøknad: originalSøknad,
    alle: alle
};
