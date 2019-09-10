const { calendarDaysBetween, newestTom, toDate, workdaysBetween } = require('../datecalc');

const antallVirkedager = behandling =>
    behandling.vedtak.perioder.reduce(
        (acc, periode) => acc + workdaysBetween(periode.fom, periode.tom),
        0
    );

const antallUtbetalingsdager = behandling =>
    behandling.beregning.dagsatser.reduce((acc, dag) => (dag.skalUtbetales ? acc + 1 : acc), 0);
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

const sisteSykdomsdag = behandling => newestTom(behandling.originalSøknad.soknadsperioder);

const utbetalingsperioder = perioder => {
    const mappedPerioder = perioder
        .map(periode => ({
            utbetalingsperiode: periode.utbetalingsperiode,
            beløp: periode.beløp
        }))
        .reduce((acc, curr) => {
            const periodensIndex = acc.findIndex(
                p => p.utbetalingsperiode === curr.utbetalingsperiode
            );
            if (periodensIndex > -1) {
                acc[periodensIndex].beløp += curr.beløp;
            } else {
                acc = [...acc, curr];
            }
            return acc;
        }, []);

    return mappedPerioder.sort((a, b) =>
        b['utbetalingsperiode'].localeCompare(a['utbetalingsperiode'])
    );
};

const beregningsperioden = behandling =>
    utbetalingsperioder(
        behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi
            .sykepengegrunnlagIArbeidsgiverperioden.grunnlag
    );

const sammenligningsperioden = behandling =>
    utbetalingsperioder(behandling.avklarteVerdier.sykepengegrunnlag.grunnlag);

const sykepengegrunnlag = behandling => {
    return behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi
        .sykepengegrunnlagNårTrygdenYter.fastsattVerdi;
};

const totaltIBeregningsperioden = behandling => {
    return (
        behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi
            .sykepengegrunnlagIArbeidsgiverperioden.fastsattVerdi * 3
    );
};

const sammenligningsgrunnlag = behandling =>
    sammenligningsperioden(behandling).reduce((acc, curr) => acc + curr.beløp, 0);

const dagsats = (behandling, periode = 0) => behandling.vedtak.perioder[periode].dagsats;

const sykmeldingsgrad = (behandling, periode = 0) =>
    behandling.originalSøknad.soknadsperioder[periode].sykmeldingsgrad;

const refusjonTilArbeidsgiver = behandling => behandling.originalSøknad.arbeidsgiverForskutterer;

const sykepengedager = (behandling, førsteSykepengedag, maksDato) => {
    const antallDagerIgjen = workdaysBetween(førsteSykepengedag, maksDato);
    const antallDagerBrukt = maxAntallSykepengedager(behandling) - antallDagerIgjen;
    return { antallDagerIgjen, antallDagerBrukt };
};

const maxAntallSykepengedager = behandling => {
    const alder = behandling.avklarteVerdier.maksdato.grunnlag.personensAlder;
    const yrkesstatus = behandling.avklarteVerdier.maksdato.grunnlag.yrkesstatus;
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
    sammenligningsgrunnlag,
    totaltIBeregningsperioden,
    sammenligningsperioden,
    sykmeldingsgrad,
    sykepengedager
};
