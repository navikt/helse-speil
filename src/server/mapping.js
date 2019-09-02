'use strict';

const selectors = require('./selectors');

const { isWithin3Months } = require('./datecalc');

const sykdomsvilkår = behandling => {
    const mindreEnnÅtteUkerSammenhengende = {
        førsteSykdomsdag:
            behandling.avklarteVerdier.opptjeningstid.grunnlag.førsteSykdomsdag,
        sisteSykdomsdag: selectors.sisteSykdomsdag(behandling)
    };

    return {
        mindreEnnÅtteUkerSammenhengende
    };
};

const inngangsvilkår = behandling => {
    const medlemskap = {
        statsborgerskap: behandling.faktagrunnlag.tps.statsborgerskap,
        bosattINorge: behandling.faktagrunnlag.tps.bostedland === 'NOR',
        diskresjonskode: behandling.faktagrunnlag.tps.diskresjonskode
    };

    const opptjening = {
        førsteSykdomsdag:
            behandling.avklarteVerdier.opptjeningstid.grunnlag.førsteSykdomsdag,
        antallDager: behandling.avklarteVerdier.opptjeningstid.fastsattVerdi,
        // kun 1 arbeidsforhold i MVP
        startdato:
            behandling.avklarteVerdier.opptjeningstid.grunnlag.arbeidsforhold
                .grunnlag?.[0].startdato,
        sluttdato:
            behandling.avklarteVerdier.opptjeningstid.grunnlag.arbeidsforhold
                .grunnlag?.[0].sluttdato
    };

    const merEnn05G = selectors.sykepengegrunnlag(behandling);

    const inntekt = {
        beløp:
            behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi
                .sykepengegrunnlagNårTrygdenYter.fastsattVerdi
    };

    const sendtNav = behandling.originalSøknad.sendtNav;
    const sisteSykdomsdag = selectors.sisteSykdomsdag(behandling);
    const søknadsfrist = {
        sendtNav: sendtNav,
        sisteSykdomsdag: sisteSykdomsdag,
        innen3Mnd: isWithin3Months(sisteSykdomsdag, sendtNav)
    };

    const førsteSykepengedag =
        behandling.avklarteVerdier.maksdato.grunnlag.førsteSykepengedag;
    const tidligerePerioder = behandling.avklarteVerdier.maksdato.grunnlag.tidligerePerioder.sort(
        (a, b) => a['tom'].localeCompare(b['tom'])
    );
    const alder = behandling.avklarteVerdier.maksdato.grunnlag.personensAlder;
    const yrkesstatus =
        behandling.avklarteVerdier.maksdato.grunnlag.yrkesstatus;
    const dagerIgjen = {
        førsteFraværsdag:
            behandling.avklarteVerdier.maksdato.grunnlag.førsteFraværsdag,
        maxDato: behandling.avklarteVerdier.maksdato.fastsattVerdi,
        dagerBrukt: selectors.sykepengedager(
            behandling,
            førsteSykepengedag,
            tidligerePerioder
        ),
        førsteSykepengedag,
        alder,
        yrkesstatus,
        tidligerePerioder
    };

    return {
        medlemskap,
        opptjening,
        merEnn05G,
        inntekt,
        søknadsfrist,
        dagerIgjen
    };
};

const oppsummering = (behandling, periode = 0) => {
    const arbeidsgiver = behandling.originalSøknad.arbeidsgiver;
    const fordelinger = behandling.vedtak.perioder[periode].fordeling;
    const sykmeldtFraOgMed = behandling.originalSøknad.fom;
    const sykmeldtTilOgMed = behandling.originalSøknad.tom;
    const sykepengegrunnlag = selectors.sykepengegrunnlag(behandling);

    const arbeidsgiverFordeling = fordelinger.find(
        fordeling => fordeling.mottager === arbeidsgiver.orgnummer
    );

    const antallUtbetalingsdager = selectors.antallUtbetalingsdager(behandling);
    const dagsats = selectors.dagsats(behandling);

    return {
        sykdomsvilkårErOppfylt: capitalize(behandling.vilkårsprøving.resultat),
        inngangsvilkårErOppfylt: capitalize(behandling.vilkårsprøving.resultat),
        arbeidsgiver: behandling.originalSøknad.arbeidsgiver,
        refusjonTilArbeidsgiver: selectors.refusjonTilArbeidsgiver(behandling),
        fordeling: arbeidsgiverFordeling ? arbeidsgiverFordeling.andel : '-',
        månedsbeløp: sykepengegrunnlag / 12,
        sykmeldingsgrad: selectors.sykmeldingsgrad(behandling),
        utbetaling: selectors.utbetalingsbeløp(behandling),
        sykepengegrunnlag,
        sykmeldtFraOgMed,
        sykmeldtTilOgMed,
        antallUtbetalingsdager,
        dagsats,
        utbetalesFom: behandling.vedtak.perioder[0].fom,
        utbetalesTom: behandling.vedtak.perioder[0].tom
    };
};

const sykepengeberegning = behandling => {
    const beregningsperioden = selectors.beregningsperioden(behandling);
    const utbetalingsperioder = selectors.utbetalingsperioder(behandling);
    const sammenligningsgrunnlag = beregningsperioden * 4;
    const sykepengegrunnlag = selectors.sykepengegrunnlag(behandling);
    const avvik =
        (Math.abs(sammenligningsgrunnlag - sykepengegrunnlag) /
            sammenligningsgrunnlag) *
        100;

    return {
        beregningsperioden,
        utbetalingsperioder,
        sammenligningsgrunnlag,
        sykepengegrunnlag,
        avvik,
        dagsats: selectors.dagsats(behandling)
    };
};

const originalSøknad = behandling => ({
    arbeidsgiver: behandling.originalSøknad.arbeidsgiver,
    aktorId: behandling.originalSøknad.aktorId,
    soknadsperioder: behandling.originalSøknad.soknadsperioder.map(periode => ({
        sykmeldingsgrad: periode.sykmeldingsgrad
    })),
    fom: behandling.originalSøknad.fom,
    tom: behandling.originalSøknad.tom
});

const utbetaling = behandling => {
    const antallUtbetalingsdager = selectors.antallUtbetalingsdager(behandling);
    const dagsats = selectors.dagsats(behandling);
    const utbetalingsbeløp = selectors.utbetalingsbeløp(behandling);

    return {
        refusjonTilArbeidsgiver: selectors.refusjonTilArbeidsgiver(behandling),
        sykepengegrunnlag: selectors.sykepengegrunnlag(behandling),
        sykmeldingsgrad: selectors.sykmeldingsgrad(behandling),
        antallUtbetalingsdager,
        dagsats,
        utbetalingsbeløp
    };
};

const periode = behandling => ({
    antallKalenderdager: selectors.antallKalenderdager(behandling),
    arbeidsgiverperiodeKalenderdager: 16,
    antallVirkedager: selectors.antallVirkedager(behandling),
    antallFeriedager: selectors.antallFeriedager(behandling),
    antallUtbetalingsdager: selectors.antallUtbetalingsdager(behandling),
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
    avklarteVerdier: avklarteVerdier(behandling),
    sykepengeberegning: sykepengeberegning(behandling)
});

const capitalize = string =>
    string[0].toUpperCase() + string.toLowerCase().substring(1);

module.exports = {
    _sykdomsvilkår: sykdomsvilkår,
    _inngangsvilkår: inngangsvilkår,
    _sykepengeberegning: sykepengeberegning,
    _oppsummering: oppsummering,
    _originalSøknad: originalSøknad,
    alle
};
