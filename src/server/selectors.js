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
    behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi.sykepengegrunnlagIArbeidsgiverperioden.fastsattVerdi;

const refusjonTilArbeidsgiver = behandling => behandling.originalSøknad.arbeidsgiverForskutterer;
const arbeidsgiverForskutterer = behandling => behandling.originalSøknad.arbeidsgiverForskutterer;

module.exports = {
    arbeidsgiverForskutterer,
    antallDager,
    betalerArbeidsgiverperiode,
    dagsats,
    refusjonTilArbeidsgiver,
    sykepengegrunnlag,
    sykmeldingsgrad
};
