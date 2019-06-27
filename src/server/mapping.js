'use strict';

const { antallKalenderdager, antallDager, sykmeldingsgrad } = require('./selectors');
const { isWithin3Months, toDate, daysBetween } = require('./datecalc');

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
    const sykmeldtFraOgMed = toDate(behandling.originalSøknad.fom);
    const sykmeldtTilOgMed = toDate(behandling.originalSøknad.tom);

    const {
        sykepengegrunnlagNårTrygdenYter,
        sykepengegrunnlagIArbeidsgiverperioden
    } = behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi;

    const sykepengegrunnlag =
        sykepengegrunnlagNårTrygdenYter.fastsattVerdi +
        sykepengegrunnlagIArbeidsgiverperioden.fastsattVerdi;

    const fordelinger = behandling.vedtak.perioder[periode].fordeling;

    const arbeidsgiverFordeling = fordelinger.find(
        fordeling => fordeling.mottager === arbeidsgiver.orgnummer
    );

    const antallDager = behandling.vedtak.perioder.reduce(
        (acc, periode) =>
            acc + daysBetween(toDate(periode.fom), toDate(periode.tom)),
        0
    );

    return {
        sykdomsvilkårErOppfylt: capitalize(behandling.vilkårsprøving.resultat),
        inngangsvilkårErOppfylt: capitalize(behandling.vilkårsprøving.resultat),
        arbeidsgiver: behandling.originalSøknad.arbeidsgiver,
        refusjonTilArbeidsgiver: behandling.originalSøknad
            .arbeidsgiverForskutterer
            ? 'Ja'
            : 'Nei',
        betalerArbeidsgiverPeriode: sykepengegrunnlagIArbeidsgiverperioden.fastsattVerdi
            ? 'Ja'
            : 'Nei',
        fordeling: arbeidsgiverFordeling ? arbeidsgiverFordeling.andel : '-',
        sykepengegrunnlag,
        månedsbeløp: sykepengegrunnlag / 12,
        dagsats: behandling.vedtak.perioder[periode].dagsats,
        antallDager,
        sykmeldtFraOgMed,
        sykmeldtTilOgMed,
        sykmeldingsgrad: behandling.vedtak.perioder[periode].grad,
        utbetaling: antallDager * behandling.vedtak.perioder[periode].dagsats
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

const periode = behandling => ({
    antallKalenderdager: antallKalenderdager(behandling),
    arbeidsgiverperiodeKalenderdager: 16,
    antallVirkedager: antallDager(behandling),
    antallFeriedager: 0,
    antallDager: antallDager(behandling),
    sykmeldingsgrad: sykmeldingsgrad(behandling),
    ingenFriskmelding: true,
    ingenGradering: true
});

const alle = behandling => ({
    behandlingsId: behandling.behandlingsId,
    inngangsvilkår: inngangsvilkår(behandling),
    oppsummering: oppsummering(behandling),
    originalSøknad: originalSøknad(behandling),
    periode: periode(behandling)
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
    inngangsvilkår,
    oppsummering,
    originalSøknad,
    alle: alle
};
