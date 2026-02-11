import React, { ReactElement } from 'react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { useGetNotaterForVedtaksperiode } from '@io/rest/generated/notater/notater';
import { isAnnullertBeregnetPeriode } from '@saksbilde/SaksbildeVarsel';
import { historikkFeil } from '@saksbilde/historikk/HistorikkFeil';
import { HistorikkVisning } from '@saksbilde/historikk/HistorikkVisning';
import { HistorikkSkeleton } from '@saksbilde/historikk/komponenter/HistorikkSkeleton';
import {
    useFilterState,
    useFilteredHistorikk,
    useShowHistorikkState,
    useShowHøyremenyState,
} from '@saksbilde/historikk/state';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { isGhostPeriode } from '@utils/typeguards';

function HistorikkWithContent(): ReactElement | null {
    const { loading, data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const aktivPeriode = useActivePeriod(person);
    const vedtaksperiodeId = (isGhostPeriode(aktivPeriode) ? undefined : aktivPeriode?.vedtaksperiodeId) ?? '';
    const {
        data: notatData,
        isPending: notaterLoading,
        isError: harNotatError,
    } = useGetNotaterForVedtaksperiode(vedtaksperiodeId);
    const historikk = useFilteredHistorikk(person, notatData ?? []);
    const [filter] = useFilterState();
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();
    const [showHøyremeny] = useShowHøyremenyState();

    useKeyboard([
        {
            key: Key.H,
            action: () => setShowHistorikk(!showHistorikk),
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

    if (loading || notaterLoading) return <HistorikkSkeleton />;
    else if (aktivPeriode == null || person == null || isGhostPeriode(aktivPeriode)) return null;

    return (
        <HistorikkVisning
            person={person}
            historikk={historikk}
            filter={filter}
            vedtaksperiodeId={aktivPeriode.vedtaksperiodeId}
            erAnnullertBeregnetPeriode={isAnnullertBeregnetPeriode(aktivPeriode)}
            visHistorikk={showHistorikk}
            visHøyremeny={showHøyremeny}
            harNotatError={harNotatError}
            lukkHistorikk={() => setShowHistorikk(false)}
        />
    );
}

export function Historikk(): ReactElement {
    return (
        <ErrorBoundary fallback={historikkFeil}>
            <HistorikkWithContent />
        </ErrorBoundary>
    );
}
