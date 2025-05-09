import dayjs from 'dayjs';
import { atom, useAtom, useAtomValue } from 'jotai';

import {
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Maybe,
    PersonFragment,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { findArbeidsgiverWithGhostPeriode, findArbeidsgiverWithPeriode } from '@state/arbeidsgiver';
import { atomWithSessionStorage } from '@state/jotai';
import { toNotat } from '@state/notater';
import { useActivePeriod } from '@state/periode';
import { Filtertype, HendelseObject, Hendelsetype } from '@typer/historikk';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

import {
    getAnnetArbeidsforholdoverstyringhendelser,
    getAnnullering,
    getArbeidsforholdoverstyringhendelser,
    getDagoverstyringer,
    getDagoverstyringerForAUU,
    getDokumenter,
    getHistorikkinnslag,
    getInntektoverstyringer,
    getInntektoverstyringerForGhost,
    getMeldingOmVedtak,
    getMinimumSykdomsgradoverstyring,
    getNotathendelser,
    getSykepengegrunnlagskjønnsfastsetting,
    getUtbetalingshendelse,
    getVedtakBegrunnelser,
} from './mapping';

const byTimestamp = (a: HendelseObject, b: HendelseObject): number => {
    return dayjs(b.timestamp).diff(dayjs(a.timestamp));
};

const getHendelserForBeregnetPeriode = (
    period: BeregnetPeriodeFragment,
    person: PersonFragment,
): Array<HendelseObject> => {
    const arbeidsgiver = findArbeidsgiverWithPeriode(period, person.arbeidsgivere);
    const dagoverstyringer = arbeidsgiver ? getDagoverstyringer(period, arbeidsgiver) : [];
    const inntektoverstyringer = arbeidsgiver ? getInntektoverstyringer(period.skjaeringstidspunkt, arbeidsgiver) : [];
    const arbeidsforholdoverstyringer = arbeidsgiver ? getArbeidsforholdoverstyringhendelser(period, arbeidsgiver) : [];
    const annetarbeidsforholdoverstyringer = getAnnetArbeidsforholdoverstyringhendelser(
        period,
        arbeidsgiver,
        person.arbeidsgivere,
    );
    const sykepengegrunnlagskjønnsfastsetting = arbeidsgiver
        ? getSykepengegrunnlagskjønnsfastsetting(period.skjaeringstidspunkt, arbeidsgiver, person.arbeidsgivere)
        : [];

    const minimumSykdomsgradoverstyring = arbeidsgiver ? getMinimumSykdomsgradoverstyring(period, arbeidsgiver) : [];

    const dokumenter = getDokumenter(period);
    const meldingOmVedtak = getMeldingOmVedtak(period);
    const notater = getNotathendelser(period.notater.map(toNotat));
    const utbetaling = getUtbetalingshendelse(period);
    const historikkinnslag = getHistorikkinnslag(period);
    const vedtakBegrunnelser = getVedtakBegrunnelser(period);
    const annullering = getAnnullering(period);

    return meldingOmVedtak.concat(
        [
            ...dokumenter,
            ...dagoverstyringer,
            ...inntektoverstyringer,
            ...arbeidsforholdoverstyringer,
            ...annetarbeidsforholdoverstyringer,
            ...sykepengegrunnlagskjønnsfastsetting,
            ...minimumSykdomsgradoverstyring,
            ...vedtakBegrunnelser,
        ]
            .filter((it: HendelseObject) =>
                period.utbetaling.vurdering?.tidsstempel
                    ? it.timestamp &&
                      dayjs(it.timestamp).startOf('s').isSameOrBefore(period.utbetaling.vurdering.tidsstempel)
                    : true,
            )
            .concat(utbetaling ? [utbetaling] : [])
            .concat(annullering ? [annullering] : [])
            .concat(notater)
            .concat(historikkinnslag)
            .sort(byTimestamp),
    );
};

const getHendelserForGhostPeriode = (period: GhostPeriodeFragment, person: PersonFragment): Array<HendelseObject> => {
    const arbeidsgiver = findArbeidsgiverWithGhostPeriode(period, person.arbeidsgivere);
    const arbeidsforholdoverstyringer = arbeidsgiver ? getArbeidsforholdoverstyringhendelser(period, arbeidsgiver) : [];
    const annetarbeidsforholdoverstyringer = getAnnetArbeidsforholdoverstyringhendelser(
        period,
        arbeidsgiver,
        person.arbeidsgivere,
    );
    const inntektoverstyringer = arbeidsgiver
        ? getInntektoverstyringerForGhost(period.skjaeringstidspunkt, arbeidsgiver, person)
        : [];

    return [...arbeidsforholdoverstyringer, ...annetarbeidsforholdoverstyringer, ...inntektoverstyringer].sort(
        byTimestamp,
    );
};

const getHendelserForUberegnetPeriode = (
    period: UberegnetPeriodeFragment,
    person: PersonFragment,
): Array<HendelseObject> => {
    const arbeidsgiver = findArbeidsgiverWithPeriode(period, person.arbeidsgivere);
    const dagoverstyringer = arbeidsgiver ? getDagoverstyringerForAUU(period, arbeidsgiver) : [];
    const inntektoverstyringer = arbeidsgiver ? getInntektoverstyringer(period.skjaeringstidspunkt, arbeidsgiver) : [];
    const notater = getNotathendelser(period.notater.map(toNotat));
    const sykepengegrunnlagskjønnsfastsetting = arbeidsgiver
        ? getSykepengegrunnlagskjønnsfastsetting(period.skjaeringstidspunkt, arbeidsgiver, person.arbeidsgivere)
        : [];

    const dokumenter = getDokumenter(period);

    return [
        ...dokumenter,
        ...dagoverstyringer,
        ...inntektoverstyringer,
        ...sykepengegrunnlagskjønnsfastsetting,
        ...notater,
    ].sort(byTimestamp);
};

const useHistorikk = (person: Maybe<PersonFragment>): HendelseObject[] => {
    const activePeriod = useActivePeriod(person);

    if (!person) {
        return [];
    }

    if (isBeregnetPeriode(activePeriod)) {
        return getHendelserForBeregnetPeriode(activePeriod, person);
    }

    if (isGhostPeriode(activePeriod)) {
        return getHendelserForGhostPeriode(activePeriod, person);
    }

    if (isUberegnetPeriode(activePeriod)) {
        return getHendelserForUberegnetPeriode(activePeriod, person);
    }

    return [];
};

const filterState = atom<Filtertype>('Historikk');

const filterMap: Record<Filtertype, Array<Hendelsetype>> = {
    Historikk: [
        'Dagoverstyring',
        'Arbeidsforholdoverstyring',
        'AnnetArbeidsforholdoverstyring',
        'Inntektoverstyring',
        'Sykepengegrunnlagskjonnsfastsetting',
        'MinimumSykdomsgradoverstyring',
        'Dokument',
        'Utbetaling',
        'Historikk',
        'Notat',
        'VedtakBegrunnelse',
        'Annullering',
    ],
    Dokument: ['Dokument'],
    Notat: ['Notat'],
    Overstyring: [
        'Dagoverstyring',
        'Arbeidsforholdoverstyring',
        'AnnetArbeidsforholdoverstyring',
        'Inntektoverstyring',
        'Sykepengegrunnlagskjonnsfastsetting',
        'MinimumSykdomsgradoverstyring',
    ],
};

const showHistorikkState = atomWithSessionStorage('showHistorikkState', true);

export const useShowHistorikkState = () => useAtom(showHistorikkState);

export const useFilteredHistorikk = (person: Maybe<PersonFragment>): Array<HendelseObject> => {
    const filter = useAtomValue(filterState);
    const historikk = useHistorikk(person);

    return historikk.filter((hendelse) => filterMap[filter].includes(hendelse.type));
};

export const useFilterState = () => useAtom(filterState);

const showHøyremenyState = atomWithSessionStorage('showHøyremenyState', true);

export const useShowHøyremenyState = () => useAtom(showHøyremenyState);
