'use strict';

const selectors = require('./selectors');

const { isWithin3Months, toDate } = require('./datecalc');

const sykdomsvilkår = behandling => {
    const mindreEnnÅtteUkerSammenhengende = {
        førsteSykdomsdag: toDate(
            behandling.avklarteVerdier.opptjeningstid.grunnlag.førsteSykdomsdag
        )
    };

    return {
        mindreEnnÅtteUkerSammenhengende
    };
};

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
        innen3Mnd: isWithin3Months(sisteSykdomsdag, sendtNav)
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
        medlemskap,
        opptjening,
        inntekt,
        søknadsfrist,
        dagerIgjen
    };
};

const oppsummering = (behandling, periode = 0) => {
    const arbeidsgiver = behandling.originalSøknad.arbeidsgiver;
    const fordelinger = behandling.vedtak.perioder[periode].fordeling;
    const sykmeldtFraOgMed = toDate(behandling.originalSøknad.fom);
    const sykmeldtTilOgMed = toDate(behandling.originalSøknad.tom);
    const sykepengegrunnlag = selectors.sykepengegrunnlag(behandling);

    const arbeidsgiverFordeling = fordelinger.find(
        fordeling => fordeling.mottager === arbeidsgiver.orgnummer
    );

    const antallDager = selectors.antallDager(behandling);
    const dagsats = selectors.dagsats(behandling);

    return {
        sykdomsvilkårErOppfylt: capitalize(behandling.vilkårsprøving.resultat),
        inngangsvilkårErOppfylt: capitalize(behandling.vilkårsprøving.resultat),
        arbeidsgiver: behandling.originalSøknad.arbeidsgiver,
        refusjonTilArbeidsgiver: selectors.refusjonTilArbeidsgiver(behandling),
        betalerArbeidsgiverPeriode: selectors.betalerArbeidsgiverperiode(
            behandling
        ),
        fordeling: arbeidsgiverFordeling ? arbeidsgiverFordeling.andel : '-',
        månedsbeløp: sykepengegrunnlag / 12,
        sykmeldingsgrad: selectors.sykmeldingsgrad(behandling),
        utbetaling: antallDager * dagsats,
        sykepengegrunnlag,
        sykmeldtFraOgMed,
        sykmeldtTilOgMed,
        antallDager,
        dagsats
    };
};

const originalSøknad = behandling => ({
    arbeidsgiver: behandling.originalSøknad.arbeidsgiver,
    aktorId: behandling.originalSøknad.aktorId,
    soknadsperioder: behandling.originalSøknad.soknadsperioder.map(periode => ({
        sykmeldingsgrad: periode.sykmeldingsgrad
    })),
    fom: toDate(behandling.originalSøknad.fom),
    tom: toDate(behandling.originalSøknad.tom)
});

const utbetaling = behandling => {
    const antallDager = selectors.antallDager(behandling);
    const dagsats = selectors.dagsats(behandling);

    return {
        refusjonTilArbeidsgiver: selectors.refusjonTilArbeidsgiver(behandling),
        betalerArbeidsgiverperiode: selectors.betalerArbeidsgiverperiode(
            behandling
        ),
        sykepengegrunnlag: selectors.sykepengegrunnlag(behandling),
        sykmeldingsgrad: selectors.sykmeldingsgrad(behandling),
        utbetaling: selectors.utbetaling(behandling),
        antallDager,
        dagsats
    };
};

const periode = behandling => ({
    antallKalenderdager: selectors.antallKalenderdager(behandling),
    arbeidsgiverperiodeKalenderdager: 16,
    antallVirkedager: selectors.antallDager(behandling),
    antallFeriedager: selectors.antallFeriedager(behandling),
    antallDager: selectors.antallDager(behandling),
    sykmeldingsgrad: selectors.sykmeldingsgrad(behandling)
});

const avklarteVerdier = behandling => ({
    sykepengegrunnlag: behandling.avklarteVerdier.sykepengegrunnlag
});

const alle = behandling => ({
    behandlingsId: behandling.behandlingsId,
    sykdomsvilkår: sykdomsvilkår(behandling),
    inngangsvilkår: inngangsvilkår(behandling),
    oppsummering: oppsummering(behandling),
    originalSøknad: originalSøknad(behandling),
    utbetaling: utbetaling(behandling),
    periode: periode(behandling),
    avklarteVerdier: avklarteVerdier(behandling)
});

const newestTom = objs => {
    return objs.reduce((max, d) => {
        const date = toDate(d.tom);
        return date > max ? date : max;
    }, toDate(objs[0].tom));
};

const capitalize = string =>
    string[0].toUpperCase() + string.toLowerCase().substring(1);

module.exports = {
    sykdomsvilkår,
    inngangsvilkår,
    oppsummering,
    originalSøknad,
    alle
};
