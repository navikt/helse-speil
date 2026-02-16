import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { DatePicker, HStack, Table, VStack, useDatepicker } from '@navikt/ds-react';

import { useLoadingToast } from '@hooks/useLoadingToast';
import { HeaderCell } from '@oversikt/table/oppgaverTable/HeaderCell';
import { IngenMatchendeFiltre } from '@oversikt/table/oppgaverTable/IngenMatchendeFiltre';
import { useCurrentPageState } from '@oversikt/table/state/pagination';
import { useBehandledeOppgaverFeed } from '@state/behandledeOppgaver';
import { cn } from '@utils/tw';

import { BehandletIdagTableSkeleton } from './BehandletIdagTableSkeleton';
import { LinkRow } from './LinkRow';
import { OppgaverTableError } from './OppgaverTableError';
import { Pagination } from './Pagination';
import { BehandletTimestampCell } from './cells/BehandletTimestampCell';
import { SaksbehandlerIdentCell } from './cells/SaksbehandlerIdentCell';
import { SøkerCell } from './cells/SøkerCell';

import styles from './table.module.css';

export const BehandletIdagTable = (): ReactElement => {
    const { oppgaver, antallOppgaver, error, loading, fetchMore, refetch } = useBehandledeOppgaverFeed();
    const [_, setCurrentPage] = useCurrentPageState();

    const harIkkeHentetOppgaverForGjeldendeQuery = oppgaver === undefined && loading;

    const fomDatePicker = useDatepicker({
        defaultSelected: new Date(),
        onDateChange: (dato) => {
            setCurrentPage(1);
            refetch(dayjs(dato), dayjs(tomDatePicker.selectedDay));
        },
    });

    const tomDatePicker = useDatepicker({
        defaultSelected: new Date(),
        onDateChange: (dato) => {
            setCurrentPage(1);
            refetch(dayjs(fomDatePicker.selectedDay), dayjs(dato));
        },
    });

    useLoadingToast({ isLoading: harIkkeHentetOppgaverForGjeldendeQuery, message: 'Henter oppgaver' });

    if (harIkkeHentetOppgaverForGjeldendeQuery) {
        return <BehandletIdagTableSkeleton />;
    }

    if (error) {
        return <OppgaverTableError />;
    }

    return (
        <VStack height="100%">
            <HStack wrap gap="space-32" marginBlock="space-24 space-16">
                <DatePicker {...fomDatePicker.datepickerProps} dropdownCaption>
                    <DatePicker.Input {...fomDatePicker.inputProps} label="Fra og med dato" size="small" />
                </DatePicker>
                <DatePicker {...tomDatePicker.datepickerProps} dropdownCaption>
                    <DatePicker.Input {...tomDatePicker.inputProps} label="Til og med dato" size="small" />
                </DatePicker>
            </HStack>
            <VStack className={cn(styles.TableContainer, loading && styles.Loading)}>
                <div className={styles.Content}>
                    <div className={styles.Scrollble}>
                        <Table className={styles.Table} aria-label="Oppgaver behandlet av meg i dag" zebraStripes>
                            <Table.Header>
                                <Table.Row>
                                    <HeaderCell text="Saksbehandler" />
                                    <HeaderCell text="Beslutter" />
                                    <HeaderCell text="Søker" />
                                    <HeaderCell text="Behandlet" />
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {oppgaver && oppgaver.length > 0 ? (
                                    oppgaver.map((oppgave) => (
                                        <LinkRow personPseudoId={oppgave.personPseudoId} key={oppgave.id}>
                                            <SaksbehandlerIdentCell
                                                name={oppgave.saksbehandler}
                                                style={{ width: 180 }}
                                            />
                                            <SaksbehandlerIdentCell name={oppgave.beslutter} />
                                            <SøkerCell
                                                name={{
                                                    fornavn: oppgave.personnavn.fornavn,
                                                    etternavn: oppgave.personnavn.etternavn,
                                                    mellomnavn: oppgave.personnavn.mellomnavn ?? null,
                                                }}
                                            />
                                            <BehandletTimestampCell dato={oppgave.ferdigstiltTidspunkt} />
                                        </LinkRow>
                                    ))
                                ) : (
                                    <IngenMatchendeFiltre />
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
                <Pagination
                    antallOppgaver={antallOppgaver}
                    fetchMore={(offset: number) => void fetchMore({ variables: { offset } })}
                />
            </VStack>
        </VStack>
    );
};
