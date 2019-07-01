const { daysBetween, toDate } = require('./datecalc');

const antallDager = behandling =>
    behandling.vedtak.perioder.reduce(
        (acc, periode) =>
            acc + daysBetween(toDate(periode.fom), toDate(periode.tom)),
        0
    );

const sykepengegrunnlag = behandling => {
    const {
        sykepengegrunnlagNårTrygdenYter,
        sykepengegrunnlagIArbeidsgiverperioden
    } = behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi;

    return (
        sykepengegrunnlagNårTrygdenYter.fastsattVerdi +
        sykepengegrunnlagIArbeidsgiverperioden.fastsattVerdi
    );
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
const arbeidsgiverForskutterer = behandling =>
    behandling.originalSøknad.arbeidsgiverForskutterer;

const antallKalenderdager = behandling => {
    const fom = toDate(behandling.originalSøknad.fom);
    const tom = toDate(behandling.originalSøknad.tom);
    return daysBetween(fom, tom);
};

const antallFeriedager = behandling => {
    if (behandling.originalSøknad.fravar.length === 0) {
        return 0;
    }
    return behandling.originalSøknad.fravar.reduce(
        (acc, fravar) =>
            fravar.type.toLowerCase() === 'ferie'
                ? acc + daysBetween(toDate(fravar.fom), toDate(fravar.tom))
                : acc + 0,
        0
    );
};

const utbetaling = behandling => {
    return behandling.beregning.dagsatser.reduce(
        (acc, dag) => (dag.skalUtbetales ? acc + dag.sats : acc + 0),
        0
    );
};

module.exports = {
    arbeidsgiverForskutterer,
    antallDager,
    antallFeriedager,
    antallKalenderdager,
    betalerArbeidsgiverperiode,
    dagsats,
    refusjonTilArbeidsgiver,
    sykepengegrunnlag,
    sykmeldingsgrad,
    utbetaling
};
