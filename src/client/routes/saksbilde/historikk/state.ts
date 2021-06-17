import { useEffect } from 'react';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { useAktivPeriode, useVedtaksperiode } from '../../../state/tidslinje';

import { Hendelse, Hendelsetype } from './Historikk.types';
import { useAnnullering, useDokumenter, useGodkjenning, useOverstyring } from './mapping';

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
    key: 'showHistorikkState',
    default: true,
});

export const useShowHistorikkState = () => useRecoilState(showHistorikkState);

export const useHistorikk = () => useRecoilValue(historikk);

export const useFilterState = () => useRecoilState(filterState);

export const useOppdaterHistorikk = () => {
    const aktivPeriode = useAktivPeriode();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode?.id!);

    const dokumenter = useDokumenter(vedtaksperiode);
    const annullering = useAnnullering(vedtaksperiode);
    const godkjenninger = useGodkjenning(vedtaksperiode);
    const overstyringer = useOverstyring(vedtaksperiode, aktivPeriode);

    const setHistorikk = useSetRecoilState(historikkState);

    const byTimestamp = (a: Hendelse, b: Hendelse): number =>
        a.timestamp === undefined ? -1 : b.timestamp === undefined ? 1 : b.timestamp.diff(a.timestamp);

    const hendelser = [...dokumenter, ...overstyringer, ...godkjenninger, ...annullering]
        .sort(byTimestamp)
        .filter((it) => !aktivPeriode || it.timestamp?.isSameOrBefore(aktivPeriode.opprettet));

    useEffect(() => {
        setHistorikk(hendelser);
    }, [aktivPeriode]);
};
