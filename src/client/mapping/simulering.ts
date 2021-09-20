import {
    SpleisDataForSimulering,
    SpleisSimuleringperiode,
    SpleisSimuleringutbetaling,
    SpleisSimuleringutbetalingDetaljer,
    Utbetaling,
    Utbetalingsdetalj,
    Utbetalingsperiode,
} from 'external-types';

const mapSimuleringsutbetalingDetaljer = (
    spleisSimuleringsutbetalingDetaljer: SpleisSimuleringutbetalingDetaljer[]
): Utbetalingsdetalj[] =>
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

const mapSimuleringsutbetalinger = (utbetalinger: SpleisSimuleringutbetaling[]): Utbetaling[] =>
    utbetalinger.map((spleisSimuleringsutbetaling) => ({
        detaljer: mapSimuleringsutbetalingDetaljer(spleisSimuleringsutbetaling.detaljer),
        feilkonto: spleisSimuleringsutbetaling.feilkonto,
        forfall: spleisSimuleringsutbetaling.forfall,
        utbetalesTilId: spleisSimuleringsutbetaling.utbetalesTilId,
        utbetalesTilNavn: spleisSimuleringsutbetaling.utbetalesTilNavn,
    }));

const mapSimuleringsperioder = (perioder: SpleisSimuleringperiode[]): Utbetalingsperiode[] =>
    perioder.map((spleisPeriode) => ({
        fom: spleisPeriode.fom,
        tom: spleisPeriode.tom,
        utbetalinger: mapSimuleringsutbetalinger(spleisPeriode.utbetalinger),
    }));

export const mapSimuleringsdata = (data?: SpleisDataForSimulering): Vedtaksperiode['simuleringsdata'] | undefined =>
    data && {
        totalbeløp: data.totalbeløp,
        perioder: mapSimuleringsperioder(data.perioder),
    };
