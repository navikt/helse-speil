import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { VStack } from '@navikt/ds-react';

import { useLoadingToast } from '@hooks/useLoadingToast';
import { IngenOppgaver } from '@oversikt/IngenOppgaver';
import { TabType, useAktivTab } from '@oversikt/tabState';
import { OppgaverTableError } from '@oversikt/table/OppgaverTableError';
import { OppgaverTableSkeleton } from '@oversikt/table/OppgaverTableSkeleton';
import { useSorteringValue } from '@oversikt/table/state/sortation';
import { useOppgaveFeed } from '@state/oppgaver';

import { Pagination } from '../Pagination';
import { useFilters, useSetMultipleFilters, useToggleFilter } from '../state/filter';
import { FilterChips } from './FilterChips';
import { MineSakerTable } from './mineSaker/MineSakerTable';
import { PåVentTable } from './påVent/PåVentTable';
import { TilGodkjenningTable } from './tilGodkjenning/TilGodkjenningTable';

import styles from '../table.module.css';

type OppgaverTableProps = {
    antallMineSaker: number;
    antallPåVent: number;
};

export const OppgaverTable = ({ antallMineSaker, antallPåVent }: OppgaverTableProps): ReactElement => {
    const { oppgaver, antallOppgaver, error, loading, fetchMore } = useOppgaveFeed();
    const { activeFilters } = useFilters();
    const aktivTab = useAktivTab();
    const sort = useSorteringValue();
    const toggleFilter = useToggleFilter();
    const setMultipleFilters = useSetMultipleFilters();

    const harIkkeHentetOppgaverForGjeldendeQuery = oppgaver === undefined && loading;

    useLoadingToast({ isLoading: harIkkeHentetOppgaverForGjeldendeQuery, message: 'Henter oppgaver' });

    if (
        oppgaver !== undefined &&
        ((aktivTab === TabType.Mine && antallMineSaker === 0) ||
            (aktivTab === TabType.Ventende && antallPåVent === 0) ||
            (aktivTab === TabType.TilGodkjenning && antallOppgaver === 0 && activeFilters.length === 0))
    ) {
        return <IngenOppgaver />;
    }

    if (harIkkeHentetOppgaverForGjeldendeQuery) {
        return <OppgaverTableSkeleton />;
    }

    if (error) {
        return <OppgaverTableError />;
    }

    return (
        <VStack marginBlock="4" className={classNames(styles.TableContainer, loading && styles.Loading)}>
            <FilterChips
                activeFilters={activeFilters}
                setMultipleFilters={setMultipleFilters}
                toggleFilter={toggleFilter}
            />
            <div className={styles.Content}>
                <div className={styles.Scrollable}>
                    {aktivTab === TabType.TilGodkjenning && (
                        <TilGodkjenningTable oppgaver={oppgaver ?? []} sort={sort} />
                    )}
                    {aktivTab === TabType.Mine && <MineSakerTable oppgaver={oppgaver ?? []} sort={sort} />}
                    {aktivTab === TabType.Ventende && <PåVentTable oppgaver={oppgaver ?? []} sort={sort} />}
                </div>
            </div>
            <Pagination
                antallOppgaver={antallOppgaver}
                fetchMore={(offset: number) => void fetchMore({ variables: { offset } })}
            />
        </VStack>
    );
};
