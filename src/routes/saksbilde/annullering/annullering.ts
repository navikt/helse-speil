import { useMemo } from 'react';

import { Dag, Maybe, Periode } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriodOld } from '@state/periode';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { somDato } from '@utils/date';
import { isBeregnetPeriode } from '@utils/typeguards';

import {
    getDagerMedUtbetaling,
    getTotalArbeidsgiverbeløp,
    getTotalPersonbeløp,
} from '../utbetaling/utbetalingstabell/dagerUtils';
import { useTabelldagerMap } from '../utbetaling/utbetalingstabell/useTabelldagerMap';

export const useTotaltUtbetaltForSykefraværstilfellet = () => {
    const tidslinjeForSykefraværstilfellet = useUtbetaltTidslinjeForSykefraværstilfellet();

    const dager = useTabelldagerMap({ tidslinje: tidslinjeForSykefraværstilfellet ?? [] });
    const utbetalingsdager = getDagerMedUtbetaling(useMemo(() => Array.from(dager.values()), [dager]));
    const arbeidsgiverTotalbeløp = getTotalArbeidsgiverbeløp(utbetalingsdager);
    const personTotalbeløp = getTotalPersonbeløp(utbetalingsdager);

    return {
        totalbeløp: personTotalbeløp + arbeidsgiverTotalbeløp,
        førsteUtbetalingsdag: finnFørsteUtbetalingsdag(utbetalingsdager),
        sisteUtbetalingsdag: finnSisteUtbetalingsdag(utbetalingsdager),
    };
};

const useUtbetaltTidslinjeForSykefraværstilfellet = (): Maybe<Dag[]> => {
    const arbeidsgiver = useCurrentArbeidsgiver();
    const skjæringstidspunkt = useActivePeriodOld()?.skjaeringstidspunkt;

    if (!arbeidsgiver || !skjæringstidspunkt) return null;

    const utbetaltePerioderINyesteGen = finnUtbetaltePerioderPåSkjæringstidspunkt(
        skjæringstidspunkt,
        arbeidsgiver.generasjoner[0].perioder,
    );
    const utbetalteVedtaksperioderINyesteGen = utbetaltePerioderINyesteGen?.map(
        ({ vedtaksperiodeId }) => vedtaksperiodeId,
    );

    const utbetaltePerioderIForrigeGenerasjon = finnUtbetaltePerioderPåSkjæringstidspunkt(
        skjæringstidspunkt,
        arbeidsgiver.generasjoner[1]?.perioder,
    );
    const utbetaltePerioderTilAnnullering = [
        ...utbetaltePerioderIForrigeGenerasjon.filter(
            ({ vedtaksperiodeId }, index) => !utbetalteVedtaksperioderINyesteGen?.includes(vedtaksperiodeId, index + 1),
        ),
        ...utbetaltePerioderINyesteGen,
    ];

    return utbetaltePerioderTilAnnullering.flatMap((it) => it.tidslinje);
};

const finnSisteUtbetalingsdag = (utbetalingsdager: Array<Utbetalingstabelldag>): string | undefined =>
    utbetalingsdager
        .flatMap((it) => it.dato)
        .sort(dateDescending)
        .shift();

const finnFørsteUtbetalingsdag = (utbetalingsdager: Array<Utbetalingstabelldag>): string | undefined =>
    utbetalingsdager
        .flatMap((it) => it.dato)
        .sort(dateDescending)
        .pop();

const finnUtbetaltePerioderPåSkjæringstidspunkt = (skjæringstidspunkt: string, perioder?: Array<Periode>): Periode[] =>
    perioder?.filter(
        (it) =>
            isBeregnetPeriode(it) &&
            it.skjaeringstidspunkt === skjæringstidspunkt &&
            it.utbetaling.vurdering?.godkjent === true,
    ) ?? [];

const dateDescending = (d1: string, d2: string): number => (somDato(d2).isBefore(somDato(d1)) ? -1 : 1);
