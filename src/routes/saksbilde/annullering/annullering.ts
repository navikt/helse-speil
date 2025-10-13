import { useMemo } from 'react';

import { Dag, Maybe, Periode, PersonFragment } from '@io/graphql';
import { Inntektsforhold, useAktivtInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { somDato } from '@utils/date';
import { isBeregnetPeriode, isSelvstendigNaering } from '@utils/typeguards';

import {
    getDagerMedUtbetaling,
    getTotalArbeidsgiverbeløp,
    getTotalPersonbeløp,
} from '../utbetaling/utbetalingstabell/dagerUtils';
import { useTabelldagerMap } from '../utbetaling/utbetalingstabell/useTabelldagerMap';

export const useTotaltUtbetaltForSykefraværstilfellet = (person: PersonFragment) => {
    const inntektsforhold = useAktivtInntektsforhold(person);
    const tidslinjeForSykefraværstilfellet = useUtbetaltTidslinjeForSykefraværstilfellet(person, inntektsforhold);

    const dager = useTabelldagerMap({
        tidslinje: tidslinjeForSykefraværstilfellet ?? [],
        erSelvstendigNæringsdrivende: isSelvstendigNaering(inntektsforhold),
    });
    const utbetalingsdager = getDagerMedUtbetaling(useMemo(() => Array.from(dager.values()), [dager]));
    const arbeidsgiverTotalbeløp = getTotalArbeidsgiverbeløp(utbetalingsdager);
    const personTotalbeløp = getTotalPersonbeløp(utbetalingsdager);

    return {
        totalbeløp: personTotalbeløp + arbeidsgiverTotalbeløp,
        førsteUtbetalingsdag: finnFørsteUtbetalingsdag(utbetalingsdager),
        sisteUtbetalingsdag: finnSisteUtbetalingsdag(utbetalingsdager),
    };
};

const useUtbetaltTidslinjeForSykefraværstilfellet = (
    person: PersonFragment,
    inntektsforhold?: Inntektsforhold,
): Maybe<Dag[]> => {
    const skjæringstidspunkt = useActivePeriod(person)?.skjaeringstidspunkt;

    if (!inntektsforhold || !skjæringstidspunkt) return null;

    const utbetaltePerioderINyesteGen = finnUtbetaltePerioderPåSkjæringstidspunkt(
        skjæringstidspunkt,
        inntektsforhold.generasjoner[0]?.perioder,
    );
    const utbetalteVedtaksperioderINyesteGen = utbetaltePerioderINyesteGen?.map(
        ({ vedtaksperiodeId }) => vedtaksperiodeId,
    );

    const utbetaltePerioderIForrigeGenerasjon = finnUtbetaltePerioderPåSkjæringstidspunkt(
        skjæringstidspunkt,
        inntektsforhold.generasjoner[1]?.perioder,
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
