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

export const mapSimuleringsdata = (
    data?: ExternalVedtaksperiode['simuleringsdata']
): Vedtaksperiode['simuleringsdata'] | undefined =>
    data && {
        totalbeløp: data.totalbeløp,
        perioder: mapSimuleringsperioder(data.perioder),
    };
