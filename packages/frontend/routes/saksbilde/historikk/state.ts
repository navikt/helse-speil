import { useEffect } from 'react';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { useNotaterForVedtaksperiode } from '@state/notater';
import { useMaybeAktivPeriode, useVedtaksperiode } from '@state/tidslinje';

import { Hendelse, Hendelsetype } from './Historikk.types';
import {
    useArbeidsforholdendringer,
    useDokumenter,
    useInntektendringer,
    useNotater,
    useTidslinjeendringer,
    useUtbetalinger,
} from './mapping';

const historikkState = atom<Hendelse[]>({
    key: 'historikkState',
    default: [],
});

export const filterState = atom<Hendelsetype>({
    key: 'filterState',
    default: Hendelsetype.Historikk,
});

const historikk = selector<Hendelse[]>({
    key: 'historikk',
    get: ({ get }) => {
        const filter = get(filterState);
        return get(historikkState).filter((it) => filter === Hendelsetype.Historikk || it.type === filter);
    },
});

const showHistorikkState = atom<boolean>({
    key: '_showHistorikkState',
    default: true,
});

export const useShowHistorikkState = () => useRecoilState(showHistorikkState);

export const useHistorikk = () => useRecoilValue(historikk);

export const useFilterState = () => useRecoilState(filterState);

type UseOppdaterHistorikkOptions = {
    onClickNotat: () => void;
    onClickTidslinjeendring: (overstyring: Overstyring) => void;
    onClickInntektendring: (overstyring: ExternalInntektoverstyring) => void;
    onClickArbeidsforholdendring: (overstyring: ExternalArbeidsforholdoverstyring) => void;
};

export const useOppdaterHistorikk = ({
    onClickNotat,
    onClickTidslinjeendring,
    onClickInntektendring,
    onClickArbeidsforholdendring,
}: UseOppdaterHistorikkOptions) => {
    const setHistorikk = useSetRecoilState(historikkState);
    const aktivPeriode = useMaybeAktivPeriode();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode?.id);
    const notaterForVedtaksperiode = useNotaterForVedtaksperiode(vedtaksperiode?.id);

    const notater = useNotater(notaterForVedtaksperiode, onClickNotat);
    const dokumenter = useDokumenter(vedtaksperiode);
    const utbetalinger = useUtbetalinger(aktivPeriode);
    const tidslinjeendringer = useTidslinjeendringer(onClickTidslinjeendring, vedtaksperiode);
    const inntektoverstyringer = useInntektendringer(onClickInntektendring);
    const arbeidsforholdoverstyringer = useArbeidsforholdendringer(onClickArbeidsforholdendring);

    useEffect(() => {
        if (!aktivPeriode) return;
        setHistorikk(
            [...dokumenter, ...tidslinjeendringer, ...inntektoverstyringer, ...arbeidsforholdoverstyringer]
                .filter((it) =>
                    aktivPeriode.tilstand !== 'utenSykefravær'
                        ? it.timestamp?.isSameOrBefore((aktivPeriode as TidslinjeperiodeMedSykefravær).opprettet)
                        : true
                )
                .concat(utbetalinger)
                .concat(notater)
                .sort((a: Hendelse, b: Hendelse): number =>
                    a.timestamp === undefined ? -1 : b.timestamp === undefined ? 1 : b.timestamp.diff(a.timestamp)
                )
        );
    }, [aktivPeriode, notater]);
};
