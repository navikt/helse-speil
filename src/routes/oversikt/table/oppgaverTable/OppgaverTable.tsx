import classNames from 'classnames';
import { useAtomValue } from 'jotai';
import React, { ReactElement } from 'react';

import { SortState, VStack } from '@navikt/ds-react';

import { useLoadingToast } from '@hooks/useLoadingToast';
import { IngenOppgaver } from '@oversikt/IngenOppgaver';
import { TabType, useAktivTab } from '@oversikt/tabState';
import { OppgaverTableError } from '@oversikt/table/OppgaverTableError';
import { OppgaverTableSkeleton } from '@oversikt/table/OppgaverTableSkeleton';
import { useCurrentPageValue } from '@oversikt/table/state/pagination';
import { useOppgaveFeed } from '@state/oppgaver';

import { Pagination } from '../Pagination';
import { useFilters, useSetMultipleFilters, useToggleFilter, valgtSaksbehandlerAtom } from '../state/filter';
import { FilterChips } from './FilterChips';
import { MineSakerTable } from './mineSaker/MineSakerTable';
import { PåVentTable } from './påVent/PåVentTable';
import { TilGodkjenningTable } from './tilGodkjenning/TilGodkjenningTable';

import styles from '../table.module.css';

type OppgaverTableProps = {
    antallMineSaker: number;
    antallPåVent: number;
    sort: SortState;
};

export const OppgaverTable = ({ antallMineSaker, antallPåVent, sort }: OppgaverTableProps): ReactElement => {
    const { oppgaver, antallOppgaver, error, loading } = useOppgaveFeed();
    const { activeFilters } = useFilters();
    const currentPage = useCurrentPageValue();
    const aktivTab = useAktivTab();
    const toggleFilter = useToggleFilter();
    const setMultipleFilters = useSetMultipleFilters();

    const harIkkeHentetOppgaverForGjeldendeQuery = oppgaver === undefined && loading;

    useLoadingToast({ isLoading: harIkkeHentetOppgaverForGjeldendeQuery, message: 'Henter oppgaver' });
    const valgtSaksbehandler = useAtomValue(valgtSaksbehandlerAtom);

    if (
        oppgaver !== undefined &&
        ((aktivTab === TabType.Mine && antallMineSaker === 0) ||
            (aktivTab === TabType.Ventende && antallPåVent === 0) ||
            (aktivTab === TabType.TilGodkjenning &&
                antallOppgaver === 0 &&
                activeFilters.length === 0 &&
                valgtSaksbehandler === null &&
                currentPage === 1))
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
        <VStack paddingBlock="4 0" className={classNames(styles.TableContainer, loading && styles.Loading)}>
            <FilterChips
                activeFilters={activeFilters}
                setMultipleFilters={setMultipleFilters}
                toggleFilter={toggleFilter}
                aktivTab={aktivTab}
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
            <Pagination antallOppgaver={antallOppgaver} fetchMore={() => {}} />
        </VStack>
    );
};
