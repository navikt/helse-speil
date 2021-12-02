const mapSimuleringsutbetalingDetaljer = (
    spleisSimuleringsutbetalingDetaljer: ExternalSimuleringsdetaljer[]
): Simuleringsutbetalingdetalj[] =>
    spleisSimuleringsutbetalingDetaljer.map((spleisDetaljer) => ({
        antallSats: spleisDetaljer.antallSats,
        belop: spleisDetaljer.beløp,
        faktiskFom: spleisDetaljer.faktiskFom,
        faktiskTom: spleisDetaljer.faktiskTom,
        klassekode: spleisDetaljer.klassekode,
        klassekodeBeskrivelse: spleisDetaljer.klassekodeBeskrivelse,
        konto: spleisDetaljer.konto,
        refunderesOrgNr: spleisDetaljer.refunderesOrgNr,
        sats: spleisDetaljer.sats,
        tilbakeforing: spleisDetaljer.tilbakeføring,
        typeSats: spleisDetaljer.typeSats,
        uforegrad: spleisDetaljer.uføregrad,
        utbetalingsType: spleisDetaljer.utbetalingstype,
    }));

const mapSimuleringsutbetalinger = (utbetalinger: ExternalSimuleringsutbetaling[]): Simuleringsutbetaling[] =>
    utbetalinger.map((spleisSimuleringsutbetaling) => ({
        detaljer: mapSimuleringsutbetalingDetaljer(spleisSimuleringsutbetaling.detaljer),
        feilkonto: spleisSimuleringsutbetaling.feilkonto,
        forfall: spleisSimuleringsutbetaling.forfall,
        utbetalesTilId: spleisSimuleringsutbetaling.utbetalesTilId,
        utbetalesTilNavn: spleisSimuleringsutbetaling.utbetalesTilNavn,
    }));

const mapSimuleringsperioder = (perioder: ExternalSimuleringsperiode[]): Simuleringsperiode[] =>
    perioder.map((spleisPeriode) => ({
        fom: spleisPeriode.fom,
        tom: spleisPeriode.tom,
        utbetalinger: mapSimuleringsutbetalinger(spleisPeriode.utbetalinger),
    }));

export const mapSimuleringsdata = (data?: ExternalVedtaksperiode['simuleringsdata']): Simuleringsdata | undefined => {
    const { arbeidsgiver, person } = (data as ExternalSimuleringsdata | undefined) ?? {};
    if (arbeidsgiver || person) {
        return {
            arbeidsgiver: arbeidsgiver && {
                totalbeløp: arbeidsgiver.totalbeløp,
                perioder: mapSimuleringsperioder(arbeidsgiver.perioder),
            },
            person: person && {
                totalbeløp: person.totalbeløp,
                perioder: mapSimuleringsperioder(person.perioder),
            },
        };
    } else if (data) {
        const { totalbeløp, perioder } = data as ExternalSimulering;
        return {
            arbeidsgiver: {
                totalbeløp: totalbeløp,
                perioder: mapSimuleringsperioder(perioder),
            },
        };
    } else {
        return undefined;
    }
};
