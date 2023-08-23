import dayjs from 'dayjs';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

import { GhostPeriode } from '@io/graphql';
import { findArbeidsgiverWithGhostPeriode, findArbeidsgiverWithPeriode } from '@state/arbeidsgiver';
import { sessionStorageEffect } from '@state/effects/sessionStorageEffect';
import { toNotat } from '@state/notater';
import { activePeriod } from '@state/periode';
import { personState } from '@state/person';
import {
    isBeregnetPeriode,
    isGhostPeriode,
    isUberegnetPeriode,
    isUberegnetVilkarsprovdPeriode,
} from '@utils/typeguards';

import {
    getAnnetArbeidsforholdoverstyringhendelser,
    getArbeidsforholdoverstyringhendelser,
    getDagoverstyringer,
    getDagoverstyringerForAUU,
    getDokumenter,
    getInntektoverstyringer,
    getInntektoverstyringerForGhost,
    getNotathendelser,
    getPeriodehistorikk,
    getSykepengegrunnlagskjønnsfastsetting,
    getUtbetalingshendelse,
} from './mapping';

const byTimestamp = (a: HendelseObject, b: HendelseObject): number => {
    return dayjs(b.timestamp).diff(dayjs(a.timestamp));
};

const getHendelserForBeregnetPeriode = (
    period: FetchedBeregnetPeriode,
    person: FetchedPerson,
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
        ? getSykepengegrunnlagskjønnsfastsetting(period.skjaeringstidspunkt, arbeidsgiver)
        : [];

    const dokumenter = getDokumenter(period);
    const notater = getNotathendelser(period.notater.map(toNotat));
    const utbetaling = getUtbetalingshendelse(period);
    const periodehistorikk = getPeriodehistorikk(period);

    return [
        ...dokumenter,
        ...dagoverstyringer,
        ...inntektoverstyringer,
        ...arbeidsforholdoverstyringer,
        ...annetarbeidsforholdoverstyringer,
        ...sykepengegrunnlagskjønnsfastsetting,
    ]
        .filter(
            (it: HendelseObject) => it.timestamp && dayjs(it.timestamp).startOf('s').isSameOrBefore(period.opprettet),
        )
        .concat(utbetaling ? [utbetaling] : [])
        .concat(notater)
        .concat(periodehistorikk)
        .sort(byTimestamp);
};

const getHendelserForGhostPeriode = (period: GhostPeriode, person: FetchedPerson): Array<HendelseObject> => {
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
    period: UberegnetPeriode | UberegnetVilkarsprovdPeriode,
    person: FetchedPerson,
): Array<HendelseObject> => {
    const arbeidsgiver = findArbeidsgiverWithPeriode(period, person.arbeidsgivere);
    const dagoverstyringer = arbeidsgiver ? getDagoverstyringerForAUU(period, arbeidsgiver) : [];
    const inntektoverstyringer = arbeidsgiver ? getInntektoverstyringer(period.skjaeringstidspunkt, arbeidsgiver) : [];
    const notater = getNotathendelser(period.notater.map(toNotat));
    const sykepengegrunnlagskjønnsfastsetting = arbeidsgiver
        ? getSykepengegrunnlagskjønnsfastsetting(period.skjaeringstidspunkt, arbeidsgiver)
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

const historikkState = selector<Array<HendelseObject>>({
    key: 'historikkState',
    get: ({ get }) => {
        const period = get(activePeriod);
        const person = get(personState).person;

        if (!person) {
            return [];
        }

        if (isBeregnetPeriode(period)) {
            return getHendelserForBeregnetPeriode(period, person);
        }

        if (isGhostPeriode(period)) {
            return getHendelserForGhostPeriode(period, person);
        }

        if (isUberegnetPeriode(period) || isUberegnetVilkarsprovdPeriode(period)) {
            return getHendelserForUberegnetPeriode(period, person);
        }

        return [];
    },
});

const filterState = atom<Filtertype>({
    key: 'filterState',
    default: 'Historikk',
});

const filterMap: Record<Filtertype, Array<Hendelsetype>> = {
    Historikk: [
        'Dagoverstyring',
        'Arbeidsforholdoverstyring',
        'AnnetArbeidsforholdoverstyring',
        'Inntektoverstyring',
        'Sykepengegrunnlagskjonnsfastsetting',
        'Dokument',
        'Utbetaling',
        'Historikk',
        'Notat',
    ],
    Dokument: ['Dokument'],
    Notat: ['Notat'],
};

const filteredHistorikkState = selector<Array<HendelseObject>>({
    key: 'historikk',
    get: ({ get }) => {
        const filter = get(filterState);
        return get(historikkState).filter((it) => filterMap[filter].includes(it.type));
    },
});

const showHistorikkState = atom<boolean>({
    key: 'showHistorikkState',
    default: true,
    effects: [sessionStorageEffect()],
});

export const useShowHistorikkState = () => useRecoilState(showHistorikkState);

export const useFilteredHistorikk = (): Array<HendelseObject> => useRecoilValue(filteredHistorikkState);

export const useFilterState = () => useRecoilState(filterState);
