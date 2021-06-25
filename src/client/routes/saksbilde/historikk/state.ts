import { useEffect } from 'react';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { useAktivPeriode, useVedtaksperiode } from '../../../state/tidslinje';

import { Hendelse, Hendelsetype } from './Historikk.types';
import { useDokumenter, useUtbetalinger, useUtbetalingsendringer } from './mapping';

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

const _showHistorikkState = atom<boolean>({
    key: '_showHistorikkState',
    default: true,
});

const showHistorikkState = selector<boolean>({
    key: 'showHistorikkState',
    get: ({ get }) => {
        return get(_showHistorikkState);
    },
    set: ({ set }, newValue) => {
        const width = newValue ? '272px' : '0px';
        document.getElementById('root')!.style.cssText = `--speil-historikk-width: ${width}`;
        set(_showHistorikkState, newValue);
    },
});

export const useShowHistorikkState = () => useRecoilState(showHistorikkState);

export const useHistorikk = () => useRecoilValue(historikk);

export const useFilterState = () => useRecoilState(filterState);

export const useOppdaterHistorikk = () => {
    const aktivPeriode = useAktivPeriode();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode?.id!);

    const dokumenter = useDokumenter(vedtaksperiode);
    const utbetalinger = useUtbetalinger(aktivPeriode);
    const utbetalingsendringer = useUtbetalingsendringer(vedtaksperiode);

    const setHistorikk = useSetRecoilState(historikkState);

    const byTimestamp = (a: Hendelse, b: Hendelse): number =>
        a.timestamp === undefined ? -1 : b.timestamp === undefined ? 1 : b.timestamp.diff(a.timestamp);

    const hendelser = [...dokumenter, ...utbetalingsendringer].filter(
        (it) => !aktivPeriode || it.timestamp?.isSameOrBefore(aktivPeriode.opprettet)
    );

    hendelser.push(...utbetalinger);
    hendelser.sort(byTimestamp);

    useEffect(() => {
        setHistorikk(hendelser);
    }, [aktivPeriode]);
};
