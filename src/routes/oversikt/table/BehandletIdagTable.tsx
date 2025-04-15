import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { DatePicker, HStack, Table, VStack, useDatepicker } from '@navikt/ds-react';

import { useLoadingToast } from '@hooks/useLoadingToast';
import { HeaderCell } from '@oversikt/table/oppgaverTable/HeaderCell';
import { IngenMatchendeFiltre } from '@oversikt/table/oppgaverTable/IngenMatchendeFiltre';
import { useBehandledeOppgaverFeed } from '@state/behandledeOppgaver';
import { ISO_DATOFORMAT } from '@utils/date';

import { LinkRow } from './LinkRow';
import { OppgaverTableError } from './OppgaverTableError';
import { OppgaverTableSkeleton } from './OppgaverTableSkeleton';
import { Pagination } from './Pagination';
import { BehandletTimestampCell } from './cells/BehandletTimestampCell';
import { SaksbehandlerIdentCell } from './cells/SaksbehandlerIdentCell';
import { SøkerCell } from './cells/SøkerCell';

import styles from './table.module.css';

export const BehandletIdagTable = (): ReactElement => {
    const { oppgaver, antallOppgaver, error, loading, fetchMore, refetch } = useBehandledeOppgaverFeed();

    const harIkkeHentetOppgaverForGjeldendeQuery = oppgaver === undefined && loading;

    const fomDatePicker = useDatepicker({
        defaultSelected: new Date(),
        onDateChange: (dato) => {
            refetch(dayjs(dato).format(ISO_DATOFORMAT), dayjs(tomDatePicker.selectedDay).format(ISO_DATOFORMAT));
        },
    });

    const tomDatePicker = useDatepicker({
        defaultSelected: new Date(),
        onDateChange: (dato) => {
            refetch(dayjs(fomDatePicker.selectedDay).format(ISO_DATOFORMAT), dayjs(dato).format(ISO_DATOFORMAT));
        },
    });

    useLoadingToast({ isLoading: harIkkeHentetOppgaverForGjeldendeQuery, message: 'Henter oppgaver' });

    if (harIkkeHentetOppgaverForGjeldendeQuery) {
        return <OppgaverTableSkeleton />;
    }

    if (error) {
        return <OppgaverTableError />;
    }

    return (
        <VStack height="100%">
            <HStack wrap gap="8" marginBlock="6 4">
                <DatePicker {...fomDatePicker.datepickerProps}>
                    <DatePicker.Input {...fomDatePicker.inputProps} label="Fra og med dato" size="small" />
                </DatePicker>
                <DatePicker {...tomDatePicker.datepickerProps}>
                    <DatePicker.Input {...tomDatePicker.inputProps} label="Til og med dato" size="small" />
                </DatePicker>
            </HStack>
            <VStack className={classNames(styles.TableContainer, loading && styles.Loading)}>
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
                                        <LinkRow aktørId={oppgave.aktorId} key={oppgave.id}>
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
