import dayjs from 'dayjs';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import {
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    NyttInntektsforholdPeriodeFragment,
    PersonFragment,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import {
    findArbeidsgiverWithGhostPeriode,
    findArbeidsgiverWithNyttInntektsforholdPeriode,
    findArbeidsgiverWithPeriode,
} from '@state/arbeidsgiver';
import { sessionStorageEffect } from '@state/effects/sessionStorageEffect';
import { toNotat } from '@state/notater';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { Filtertype, HendelseObject, Hendelsetype } from '@typer/historikk';
import { isBeregnetPeriode, isGhostPeriode, isTilkommenInntekt, isUberegnetPeriode } from '@utils/typeguards';

import {
    getAnnetArbeidsforholdoverstyringhendelser,
    getAnnullering,
    getArbeidsforholdoverstyringhendelser,
    getAvslag,
    getDagoverstyringer,
    getDagoverstyringerForAUU,
    getDokumenter,
    getInntektoverstyringer,
    getInntektoverstyringerForGhost,
    getMeldingOmVedtak,
    getMinimumSykdomsgradoverstyring,
    getNotathendelser,
    getPeriodehistorikk,
    getSykepengegrunnlagskjønnsfastsetting,
    getUtbetalingshendelse,
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
    const periodehistorikk = getPeriodehistorikk(period);
    const avslag = getAvslag(period);
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
            ...avslag,
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
            .concat(periodehistorikk)
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

const getHendelserForNyttInntektsforholdPeriode = (
    period: NyttInntektsforholdPeriodeFragment,
    person: PersonFragment,
): Array<HendelseObject> => {
    const arbeidsgiver = findArbeidsgiverWithNyttInntektsforholdPeriode(period, person.arbeidsgivere);
    const arbeidsforholdoverstyringer = arbeidsgiver ? getArbeidsforholdoverstyringhendelser(period, arbeidsgiver) : [];
    const inntektoverstyringer = arbeidsgiver
        ? getInntektoverstyringerForGhost(period.skjaeringstidspunkt, arbeidsgiver, person)
        : [];

    return [...arbeidsforholdoverstyringer, ...inntektoverstyringer].sort(byTimestamp);
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

const useHistorikk = (): HendelseObject[] => {
    const { data } = useFetchPersonQuery();
    const person = data?.person ?? null;
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

    if (isTilkommenInntekt(activePeriod)) {
        return getHendelserForNyttInntektsforholdPeriode(activePeriod, person);
    }

    if (isUberegnetPeriode(activePeriod)) {
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
        'MinimumSykdomsgradoverstyring',
        'Dokument',
        'Utbetaling',
        'Historikk',
        'Notat',
        'Avslag',
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
