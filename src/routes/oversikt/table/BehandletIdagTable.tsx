import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { ReactElement, useState } from 'react';

import { DatePicker, HStack, Table, VStack, useDatepicker } from '@navikt/ds-react';

import { useLoadingToast } from '@hooks/useLoadingToast';
import { HeaderCell } from '@oversikt/table/oppgaverTable/HeaderCell';
import { useBehandledeOppgaverFeed } from '@state/behandledeOppgaver';
import { ISO_DATOFORMAT, somDate, somNorskDato } from '@utils/date';

import { LinkRow } from './LinkRow';
import { OppgaverTableError } from './OppgaverTableError';
import { BehandledeOppgaverTableSkeleton } from './OppgaverTableSkeleton';
import { Pagination } from './Pagination';
import { BehandletTimestampCell } from './cells/BehandletTimestampCell';
import { SaksbehandlerIdentCell } from './cells/SaksbehandlerIdentCell';
import { SøkerCell } from './cells/SøkerCell';

import styles from './table.module.css';

export const BehandletIdagTable = (): ReactElement => {
    const [datoIntervall, setDatoIntervall] = useState({
        fom: dayjs().format(ISO_DATOFORMAT),
        tom: dayjs().format(ISO_DATOFORMAT),
    });
    const { oppgaver, antallOppgaver, error, loading, fetchMore, refetch } = useBehandledeOppgaverFeed(
        datoIntervall.fom,
        datoIntervall.tom,
    );

    const harIkkeHentetOppgaverForGjeldendeQuery = oppgaver === undefined && loading;

    const fomDatePicker = useDatepicker({
        defaultSelected: somDate(datoIntervall.fom),
        defaultMonth: somDate(datoIntervall.fom),
        onDateChange: (dato) => {
            refetch(datoIntervall.fom, datoIntervall.tom);
            setDatoIntervall((prevState) => ({ ...prevState, fom: dayjs(dato).format(ISO_DATOFORMAT) }));
        },
    });

    const tomDatePicker = useDatepicker({
        defaultSelected: somDate(datoIntervall.tom),
        defaultMonth: somDate(datoIntervall.tom),
        onDateChange: (dato) => {
            refetch(datoIntervall.fom, datoIntervall.tom);
            setDatoIntervall((prevState) => ({ ...prevState, tom: dayjs(dato).format(ISO_DATOFORMAT) }));
        },
    });

    useLoadingToast({ isLoading: harIkkeHentetOppgaverForGjeldendeQuery, message: 'Henter oppgaver' });

    if (error) {
        return <OppgaverTableError />;
    }

    return (
        <VStack height="100%">
            <HStack wrap gap="8" marginBlock="4 6">
                <DatePicker {...fomDatePicker.datepickerProps}>
                    <DatePicker.Input
                        {...fomDatePicker.inputProps}
                        value={somNorskDato(datoIntervall.fom)}
                        label="Fra og med dato"
                        size="small"
                    />
                </DatePicker>
                <DatePicker {...tomDatePicker.datepickerProps}>
                    <DatePicker.Input
                        {...tomDatePicker.inputProps}
                        value={somNorskDato(datoIntervall.tom)}
                        label="Til og med dato"
                        size="small"
                    />
                </DatePicker>
            </HStack>
            <>
                {harIkkeHentetOppgaverForGjeldendeQuery ? (
                    <BehandledeOppgaverTableSkeleton />
                ) : (
                    <VStack className={classNames(styles.TableContainer, loading && styles.Loading)}>
                        <div className={styles.Content}>
                            <div className={styles.Scrollble}>
                                <Table
                                    className={styles.Table}
                                    aria-label="Oppgaver behandlet av meg i dag"
                                    zebraStripes
                                >
                                    <Table.Header>
                                        <Table.Row>
                                            <HeaderCell text="Saksbehandler" />
                                            <HeaderCell text="Beslutter" />
                                            <HeaderCell text="Søker" />
                                            <HeaderCell text="Behandlet" />
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {oppgaver?.map((oppgave) => (
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
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        </div>
                        <Pagination
                            antallOppgaver={antallOppgaver}
                            fetchMore={(offset: number) => void fetchMore({ variables: { offset } })}
                        />
                    </VStack>
                )}
            </>
        </VStack>
    );
};
