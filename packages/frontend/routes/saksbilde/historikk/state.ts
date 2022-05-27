import { useEffect } from 'react';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import dayjs from 'dayjs';

import { toNotat } from '@state/notater';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { GhostPeriode, Overstyring } from '@io/graphql';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

import { Hendelse, Hendelsetype } from './Historikk.types';
import {
    getUtbetalingshendelse,
    useArbeidsforholdoverstyringshendelser,
    useDagoverstyringshendelser,
    useDokumenter,
    usePeriodehistorikk,
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
    periode: BeregnetPeriode | GhostPeriode;
    onClickNotat: () => void;
    onClickOverstyringshendelse: (overstyring: Overstyring) => void;
};

export const useOppdaterHistorikk = ({
    periode,
    onClickNotat,
    onClickOverstyringshendelse,
}: UseOppdaterHistorikkOptions) => {
    const setHistorikk = useSetRecoilState(historikkState);
    const overstyringer = useCurrentArbeidsgiver()?.overstyringer ?? [];

    const notaterForPeriode = isBeregnetPeriode(periode) ? periode.notater.map(toNotat) : [];
    const notater = useNotater(notaterForPeriode, onClickNotat);
    const dokumenter = useDokumenter(periode);
    const utbetaling = getUtbetalingshendelse(periode);
    const periodehistorikk = usePeriodehistorikk(periode, onClickNotat);

    const tidslinjeendringer = useDagoverstyringshendelser(onClickOverstyringshendelse, overstyringer);
    const inntektoverstyringer = useInntektsoverstyringshendelser(onClickOverstyringshendelse, overstyringer);
    const arbeidsforholdoverstyringer = useArbeidsforholdoverstyringshendelser(
        onClickOverstyringshendelse,
        overstyringer,
    );

    useEffect(() => {
        if (periode) {
            setHistorikk(
                [...dokumenter, ...tidslinjeendringer, ...inntektoverstyringer, ...arbeidsforholdoverstyringer]
                    .filter(
                        (it: Hendelse) =>
                            isGhostPeriode(periode) ||
                            (it.timestamp && dayjs(it.timestamp).isSameOrBefore(periode.opprettet)),
                    )
                    .concat(utbetaling ? [utbetaling] : [])
                    .concat(notater)
                    .concat(periodehistorikk)
                    .sort((a: Hendelse, b: Hendelse): number =>
                        typeof a.timestamp !== 'string'
                            ? -1
                            : typeof b.timestamp !== 'string'
                            ? 1
                            : dayjs(b.timestamp).diff(dayjs(a.timestamp)),
                    ),
            );
        }
    }, [periode, notater]);
};
