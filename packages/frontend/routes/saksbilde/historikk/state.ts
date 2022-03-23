import { useEffect } from 'react';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import dayjs from 'dayjs';

import { useNotaterForVedtaksperiode } from '@state/notater';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiverState';
import { GhostPeriode, Overstyring, Periode } from '@io/graphql';
import { isGhostPeriode } from '@utils/typeguards';

import { Hendelse, Hendelsetype } from './Historikk.types';
import {
    getUtbetalingshendelse,
    useArbeidsforholdoverstyringshendelser,
    useDagoverstyringshendelser,
    useDokumenter,
    useInntektsoverstyringshendelser,
    useNotater,
} from './mapping';

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

type UseOppdaterHistorikkOptions = {
    periode: Periode | GhostPeriode;
    onClickNotat: () => void;
    onClickOverstyringshendelse: (overstyring: Overstyring) => void;
    vedtaksperiodeId?: string;
};

export const useOppdaterHistorikk = ({
    vedtaksperiodeId,
    periode,
    onClickNotat,
    onClickOverstyringshendelse,
}: UseOppdaterHistorikkOptions) => {
    const setHistorikk = useSetRecoilState(historikkState);
    const overstyringer = useCurrentArbeidsgiver()?.overstyringer ?? [];

    const notaterForVedtaksperiode = useNotaterForVedtaksperiode(vedtaksperiodeId);
    const notater = useNotater(notaterForVedtaksperiode, onClickNotat);
    const dokumenter = useDokumenter(periode);
    const utbetaling = getUtbetalingshendelse(periode);

    const tidslinjeendringer = useDagoverstyringshendelser(onClickOverstyringshendelse, overstyringer);
    const inntektoverstyringer = useInntektsoverstyringshendelser(onClickOverstyringshendelse, overstyringer);
    const arbeidsforholdoverstyringer = useArbeidsforholdoverstyringshendelser(
        onClickOverstyringshendelse,
        overstyringer
    );

    useEffect(() => {
        if (periode) {
            setHistorikk(
                [...dokumenter, ...tidslinjeendringer, ...inntektoverstyringer, ...arbeidsforholdoverstyringer]
                    .filter(
                        (it: Hendelse) =>
                            isGhostPeriode(periode) ||
                            (it.timestamp && dayjs(it.timestamp).isSameOrAfter(periode.opprettet))
                    )
                    .concat(utbetaling ? [utbetaling] : [])
                    .concat(notater)
                    .sort((a: Hendelse, b: Hendelse): number =>
                        typeof a.timestamp !== 'string'
                            ? -1
                            : typeof b.timestamp !== 'string'
                            ? 1
                            : dayjs(b.timestamp).diff(dayjs(a.timestamp))
                    )
            );
        }
    }, [periode, notater]);
};
