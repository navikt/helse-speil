const {
    calendarDaysBetween,
    newestTom,
    toDate,
    workdaysBetween
} = require('./datecalc');

const antallVirkedager = behandling =>
    behandling.vedtak.perioder.reduce(
        (acc, periode) => acc + workdaysBetween(periode.fom, periode.tom),
        0
    );

const antallUtbetalingsdager = behandling =>
    behandling.beregning.dagsatser.reduce(
        (acc, dag) => (dag.skalUtbetales ? acc + 1 : acc),
        0
    );
const utbetalingsbeløp = behandling =>
    behandling.beregning.dagsatser.reduce(
        (acc, dagsats) => (dagsats.skalUtbetales ? acc + dagsats.sats : acc),
        0
    );

const antallFeriedager = behandling => {
    const fravarAccumulator = (acc, fravar) => {
        return fravar.type.toLowerCase() === 'ferie'
            ? acc + calendarDaysBetween(toDate(fravar.fom), toDate(fravar.tom))
            : acc + 0;
    };
    return behandling.originalSøknad.fravar.length === 0
        ? 0
        : behandling.originalSøknad.fravar.reduce(fravarAccumulator, 0);
};

const antallKalenderdager = behandling => {
    const fom = toDate(behandling.originalSøknad.fom);
    const tom = toDate(behandling.originalSøknad.tom);
    return calendarDaysBetween(fom, tom);
};

const sisteSykdomsdag = behandling =>
    newestTom(behandling.originalSøknad.soknadsperioder);

const utbetalingsperioder = behandling => {
    const UTBETALINGSPERIODE = 'utbetalingsperiode';
    const BELØP = 'beløp';

    const perioder = behandling.avklarteVerdier.sykepengegrunnlag.grunnlag
        .map(periode => ({
            utbetalingsperiode: periode.utbetalingsperiode,
            beløp: periode.beløp
        }))
        .reduce((prev, curr) => {
            if (prev[curr[UTBETALINGSPERIODE]]) {
                prev[curr[UTBETALINGSPERIODE]] += curr[BELØP];
            } else {
                prev[curr[UTBETALINGSPERIODE]] = curr[BELØP];
            }
            return prev;
        }, {});

    return Object.entries(perioder).sort((a, b) => b[0].localeCompare(a[0]));
};

const sykepengegrunnlag = behandling => {
    return behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi
        .sykepengegrunnlagNårTrygdenYter.fastsattVerdi;
};

const beregningsperioden = behandling => {
    return (
        behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi
            .sykepengegrunnlagIArbeidsgiverperioden.fastsattVerdi * 3
    );
};

const dagsats = (behandling, periode = 0) =>
    behandling.vedtak.perioder[periode].dagsats;

const sykmeldingsgrad = (behandling, periode = 0) =>
    behandling.vedtak.perioder[periode].grad;

const refusjonTilArbeidsgiver = behandling =>
    behandling.originalSøknad.arbeidsgiverForskutterer;

const sykepengedager = (behandling, førsteSykepengedag, maksDato) => {
    const antallDagerIgjen = workdaysBetween(førsteSykepengedag, maksDato);
    const antallDagerBrukt =
        maxAntallSykepengedager(behandling) - antallDagerIgjen;
    return { antallDagerIgjen, antallDagerBrukt };
};

const maxAntallSykepengedager = behandling => {
    const alder = behandling.avklarteVerdier.maksdato.grunnlag.personensAlder;
    const yrkesstatus =
        behandling.avklarteVerdier.maksdato.grunnlag.yrkesstatus;
    if (alder >= 67 && alder <= 70) return 60;
    else if (yrkesstatus === 'IKKE_I_ARBEID') return 250;
    else return 248;
};

module.exports = {
    antallVirkedager,
    antallUtbetalingsdager,
    antallFeriedager,
    antallKalenderdager,
    dagsats,
    utbetalingsbeløp,
    refusjonTilArbeidsgiver,
    sisteSykdomsdag,
    sykepengegrunnlag,
    beregningsperioden,
    utbetalingsperioder,
    sykmeldingsgrad,
    sykepengedager
};
