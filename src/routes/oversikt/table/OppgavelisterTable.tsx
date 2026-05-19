'use client';

import { ReactElement } from 'react';

import { Chips, Table, VStack } from '@navikt/ds-react';

import { useLoadingToast } from '@hooks/useLoadingToast';
import { PREDEFINERTE_OPPGAVELISTER } from '@oversikt/oppgavelister';
import { BehandletIdagTableSkeleton } from '@oversikt/table/BehandletIdagTableSkeleton';
import { OppgaverTableError } from '@oversikt/table/OppgaverTableError';
import { Pagination } from '@oversikt/table/Pagination';
import { HeaderCell } from '@oversikt/table/oppgaverTable/HeaderCell';
import { IngenMatchendeFiltre } from '@oversikt/table/oppgaverTable/IngenMatchendeFiltre';
import { TilGodkjenningOppgaveRow } from '@oversikt/table/oppgaverTable/tilGodkjenning/TilGodkjenningOppgaveRow';
import { useAktivOppgaveliste, useOppgavelisteFeed, useSetAktivOppgaveliste } from '@state/oppgavelister';
import { cn } from '@utils/tw';

const OppgavelisteVelger = (): ReactElement => {
    const aktivOppgaveliste = useAktivOppgaveliste();
    const setAktivOppgaveliste = useSetAktivOppgaveliste();

    return (
        <Chips className="mx-3 mt-3 mb-2">
            {PREDEFINERTE_OPPGAVELISTER.map((liste) => (
                <Chips.Toggle
                    key={liste.id}
                    selected={aktivOppgaveliste.id === liste.id}
                    onClick={() => setAktivOppgaveliste(liste.id)}
                >
                    {liste.navn}
                </Chips.Toggle>
            ))}
        </Chips>
    );
};

export const OppgavelisterTable = (): ReactElement => {
    const { oppgaver, antallOppgaver, error, loading } = useOppgavelisteFeed();
    const aktivOppgaveliste = useAktivOppgaveliste();
    const harIkkeHentetOppgaverForGjeldendeQuery = oppgaver === undefined && loading;

    useLoadingToast({ isLoading: harIkkeHentetOppgaverForGjeldendeQuery, message: 'Henter oppgaver' });

    if (harIkkeHentetOppgaverForGjeldendeQuery) {
        return <BehandletIdagTableSkeleton />;
    }

    if (error) {
        return <OppgaverTableError />;
    }

    return (
        <VStack className={cn('h-full overflow-auto', loading && '[&_tbody]:opacity-60 [&_tbody]:transition-opacity')}>
            <OppgavelisteVelger />
            <div className="flex-1 overflow-auto p-0 text-ax-text-neutral [scrollbar-width:none]">
                <div className="m-0 h-[calc(100%-50px)] w-full p-0">
                    <Table aria-label={aktivOppgaveliste.navn} zebraStripes>
                        <Table.Header>
                            <Table.Row>
                                <HeaderCell text="Saksbehandler" />
                                <Table.DataCell rowSpan={2} />
                                <HeaderCell text="Dato" />
                                <Table.DataCell rowSpan={2} aria-label="valg" />
                                <Table.DataCell rowSpan={2} aria-label="notater" />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {oppgaver && oppgaver.length > 0 ? (
                                oppgaver.map((oppgave) => (
                                    <TilGodkjenningOppgaveRow key={oppgave.id} oppgave={oppgave} />
                                ))
                            ) : (
                                <IngenMatchendeFiltre />
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>
            <Pagination antallOppgaver={antallOppgaver} />
        </VStack>
    );
};
