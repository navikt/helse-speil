import { useEffect } from 'react';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { useNotaterForVedtaksperiode } from '../../../state/notater';
import { useAktivPeriode, useVedtaksperiode } from '../../../state/tidslinje';

import { Hendelse, Hendelsetype } from './Historikk.types';
import { useDokumenter, useNotater, useUtbetalinger, useUtbetalingsendringer } from './mapping';

const historikkState = atom<Hendelse[]>({
    key: 'historikkState',
    default: [],
});

const filterState = atom<Hendelsetype>({
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

export const useOppdaterHistorikk = (onNotatLenkeClick: () => void) => {
    const aktivPeriode = useAktivPeriode();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode?.id!);

    const dokumenter = useDokumenter(vedtaksperiode);
    const utbetalinger = useUtbetalinger(aktivPeriode);
    const utbetalingsendringer = useUtbetalingsendringer(vedtaksperiode);

    const notaterForVedtaksperiode = useNotaterForVedtaksperiode(vedtaksperiode?.id!);
    const notater = useNotater(notaterForVedtaksperiode, onNotatLenkeClick);

    const setHistorikk = useSetRecoilState(historikkState);

    const byTimestamp = (a: Hendelse, b: Hendelse): number =>
        a.timestamp === undefined ? -1 : b.timestamp === undefined ? 1 : b.timestamp.diff(a.timestamp);

    const hendelser = [...dokumenter, ...utbetalingsendringer].filter(
        (it) => !aktivPeriode || it.timestamp?.isSameOrBefore(aktivPeriode.opprettet)
    );

    hendelser.push(...utbetalinger);
    hendelser.push(...notater);
    hendelser.sort(byTimestamp);

    useEffect(() => {
        setHistorikk(hendelser);
    }, [aktivPeriode, notater]);
};
