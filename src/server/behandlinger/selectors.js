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

const ferieperioder = behandling => {
    if (!behandling.originalSøknad.fravar) {
        const logStructureOfTree = (object, stack) => {
            if (object && Object.keys(object).length === 0) {
                console.log(stack + '.[]');
            }
            for (var property in object) {
                // filter out non-essential keys
                if (
                    property === 'vilkårsprøving' ||
                    property === 'beregning' ||
                    property === 'avklarteVerdier' ||
                    property === 'arbeidInntektYtelse' ||
                    property === 'sammenligningsperiode' ||
                    property === 'beregningsperiode'
                )
                    continue;
                if (Object.prototype.hasOwnProperty.call(object, property)) {
                    if (typeof object[property] == 'object') {
                        logStructureOfTree(object[property], stack + '.' + property);
                    } else {
                        console.log(stack + '.' + property);
                    }
                }
            }
        };
        console.log('Struktur på behandling som mangler fravær:');
        logStructureOfTree(behandling, '');
        return [];
    }
    return behandling.originalSøknad.fravar.filter(
        periode => periode.type.toLowerCase() === 'ferie'
    );
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

const beregningsperioden = behandling => {
    const beregningsperiode =
        behandling.avklarteVerdier.sykepengegrunnlag.fastsattVerdi
            .sykepengegrunnlagIArbeidsgiverperioden.grunnlag;
    if (!Array.isArray(beregningsperiode)) {
        console.log('Forventer en liste, men beregningsperioden er ', typeof beregningsperiode);
        console.log(Object.keys(beregningsperiode).toString());
        if (beregningsperiode.inntekter) {
            console.log('Inntekter keys: ', Object.keys(beregningsperiode.inntekter).toString());
        }
        if (beregningsperiode.begrunnelse) {
            console.log('Begrunnelse: ', beregningsperiode.begrunnelse);
        }
    }
    return utbetalingsperioder(beregningsperiode);
};

const sammenligningsperioden = behandling => {
    const sammenligningsperiode = behandling.avklarteVerdier.sykepengegrunnlag.grunnlag;
    if (!Array.isArray(sammenligningsperiode)) {
        console.log(
            'Forventer en liste, men sammenligningsgrunnlag er ',
            typeof sammenligningsperiode
        );
        console.log(Object.keys(sammenligningsperiode).toString());
    }
    return utbetalingsperioder(sammenligningsperiode);
};

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
    ferieperioder,
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
