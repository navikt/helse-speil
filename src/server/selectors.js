const { daysBetween, toDate, newestTom, sortObjectsWithDate } = require('./datecalc');

const antallDager = behandling =>
    behandling.vedtak.perioder.reduce(
        (acc, periode) =>
            acc + daysBetween(toDate(periode.fom), toDate(periode.tom)),
        0
    );

const antallFeriedager = behandling => {
    const fravarAccumulator = (acc, fravar) => {
        return fravar.type.toLowerCase() === 'ferie'
            ? acc + daysBetween(toDate(fravar.fom), toDate(fravar.tom))
            : acc + 0;
    };
    return behandling.originalSøknad.fravar.length === 0
        ? 0
        : behandling.originalSøknad.fravar.reduce(fravarAccumulator, 0);
};

const antallKalenderdager = behandling => {
    const fom = toDate(behandling.originalSøknad.fom);
    const tom = toDate(behandling.originalSøknad.tom);
    return daysBetween(fom, tom);
};

const sisteSykdomsdag = behandling =>
    newestTom(behandling.originalSøknad.soknadsperioder);

const sykepengegrunnlag = behandling =>
    behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi
        .sykepengegrunnlagNårTrygdenYter.fastsattVerdi;

const utbetalinger = behandling =>
    behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi.sykepengegrunnlagNårTrygdenYter.grunnlag
        .map(periode => ({
            utbetalingsperiode: periode.utbetalingsperiode,
            beløp: periode.beløp
        }))
        .sort((periodeA, periodeB) =>
            sortObjectsWithDate(periodeA, periodeB, 'utbetalingsperiode')
        );

const beregningsperioden = behandling => {
    const beregningsperiode = utbetalinger(behandling).slice(0, 3);
    return beregningsperiode;
};

const avvik = behandling => {
    const sammenligningsgrunnlag = utbetalinger(behandling).reduce(
        (acc, periode) => acc + periode.beløp,
        0
    );
    const beregningsperioden = utbetalinger(behandling)
        .slice(0, 3)
        .reduce((acc, periode) => acc + periode.beløp, 0);
    const aktuellMånedsinntekt = beregningsperioden / 3;
    const omregnetÅrsinntekt = aktuellMånedsinntekt * 12;
    const avvik =
        Math.abs(omregnetÅrsinntekt - sammenligningsgrunnlag) /
        sammenligningsgrunnlag;
    return avvik;
};

const dagsats = (behandling, periode = 0) =>
    behandling.vedtak.perioder[periode].dagsats;

const sykmeldingsgrad = (behandling, periode = 0) =>
    behandling.vedtak.perioder[periode].grad;

const betalerArbeidsgiverperiode = behandling =>
    behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi
        .sykepengegrunnlagIArbeidsgiverperioden.fastsattVerdi;

const refusjonTilArbeidsgiver = behandling =>
    behandling.originalSøknad.arbeidsgiverForskutterer;

const utbetaling = behandling => {
    return behandling.beregning.dagsatser.reduce(
        (acc, dag) => (dag.skalUtbetales ? acc + dag.sats : acc + 0),
        0
    );
};

module.exports = {
    antallDager,
    antallFeriedager,
    antallKalenderdager,
    betalerArbeidsgiverperiode,
    dagsats,
    refusjonTilArbeidsgiver,
    sisteSykdomsdag,
    sykepengegrunnlag,
    beregningsperioden,
    utbetalinger,
    avvik,
    sykmeldingsgrad,
    utbetaling
};
