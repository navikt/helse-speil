import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { useGetNotaterForVedtaksperiode } from '@io/rest/generated/notater/notater';
import { isAnnullertBeregnetPeriode } from '@saksbilde/SaksbildeVarsel';
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
import { cn } from '@utils/tw';
import { isGhostPeriode } from '@utils/typeguards';

import styles from './Historikk.module.css';

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

function HistorikkError(): ReactElement {
    return (
        <div className={cn(styles.historikk, styles.error)}>
            <ul>
                <div>
                    <BodyShort>Noe gikk galt. Kan ikke vise historikk for perioden.</BodyShort>
                </div>
            </ul>
        </div>
    );
}

export function Historikk(): ReactElement {
    return (
        <ErrorBoundary fallback={<HistorikkError />}>
            <HistorikkWithContent />
        </ErrorBoundary>
    );
}
