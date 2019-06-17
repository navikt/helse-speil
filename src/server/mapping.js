'use strict';

const inngangsvilkår = behandling => {
    const medlemsskap = {
        bostedsland: behandling.faktagrunnlag.tps.bostedland
    };

    const opptjening = {
        førsteSykdomsdag: toDate(
            behandling.avklarteVerdier.opptjeningstid.grunnlag.førsteSykdomsdag
        ),
        antallDager: behandling.avklarteVerdier.opptjeningstid.fastsattVerdi,
        // kun 1 arbeidsforhold i MVP
        startdato: toDate(
            behandling.avklarteVerdier.opptjeningstid.grunnlag.arbeidsforhold[0]
                .startdato
        ),
        sluttdato: toDate(
            behandling.avklarteVerdier.opptjeningstid.grunnlag.arbeidsforhold[0]
                .sluttdato
        )
    };

    const inntekt = {
        beløp:
            behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi
                .sykepengegrunnlagNårTrygdenYter.fastsattVerdi
    };

    const søknadsfrist = {
        sendtNav: toDate(behandling.originalSøknad.sendtNav),
        sisteSykdomsdag: newestTom(behandling.originalSøknad.soknadsperioder),
        antallMnd: 0
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
        medlemsskap: medlemsskap,
        opptjening: opptjening,
        inntekt: inntekt,
        søknadsfrist: søknadsfrist,
        dagerIgjen: dagerIgjen
    };
};

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
    inngangsvilkår: inngangsvilkår
};
