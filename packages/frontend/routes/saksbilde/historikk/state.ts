import dayjs from 'dayjs';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import { GhostPeriode } from '@io/graphql';
import { findArbeidsgiverWithGhostPeriode, findArbeidsgiverWithPeriode } from '@state/arbeidsgiver';
import { sessionStorageEffect } from '@state/effects/sessionStorageEffect';
import { toNotat } from '@state/notater';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
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
        ? getSykepengegrunnlagskjønnsfastsetting(period.skjaeringstidspunkt, arbeidsgiver, person.arbeidsgivere)
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
        .filter((it: HendelseObject) =>
            period.utbetaling.vurdering?.tidsstempel
                ? it.timestamp &&
                  dayjs(it.timestamp).startOf('s').isSameOrBefore(period.utbetaling.vurdering.tidsstempel)
                : true,
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

const useHistorikk = (): HendelseObject[] => {
    const activePeriod = useActivePeriod();
    const { data } = useFetchPersonQuery();
    const person = data?.person;

    if (!person) {
        return [];
    }

    if (isBeregnetPeriode(activePeriod)) {
        return getHendelserForBeregnetPeriode(activePeriod, person);
    }

    if (isGhostPeriode(activePeriod)) {
        return getHendelserForGhostPeriode(activePeriod, person);
    }

    if (isUberegnetPeriode(activePeriod) || isUberegnetVilkarsprovdPeriode(activePeriod)) {
        return getHendelserForUberegnetPeriode(activePeriod, person);
    }

    return [];
};

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
    Overstyring: [
        'Dagoverstyring',
        'Arbeidsforholdoverstyring',
        'AnnetArbeidsforholdoverstyring',
        'Inntektoverstyring',
        'Sykepengegrunnlagskjonnsfastsetting',
    ],
};

const showHistorikkState = atom<boolean>({
    key: 'showHistorikkState',
    default: true,
    effects: [sessionStorageEffect()],
});

export const useShowHistorikkState = () => useRecoilState(showHistorikkState);

export const useFilteredHistorikk = (): Array<HendelseObject> => {
    const filter = useRecoilValue(filterState);
    const historikk = useHistorikk();

    return historikk.filter((hendelse) => filterMap[filter].includes(hendelse.type));
};

export const useFilterState = () => useRecoilState(filterState);
