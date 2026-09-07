'use client';

import { ReactElement, useRef, useState } from 'react';

import { Box, Button, ErrorMessage, HStack, Table, VStack } from '@navikt/ds-react';

import { useLoadingToast } from '@hooks/useLoadingToast';
import { ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { BehandletIdagTableSkeleton } from '@oversikt/table/BehandletIdagTableSkeleton';
import { OppgaverTableError } from '@oversikt/table/OppgaverTableError';
import { Pagination } from '@oversikt/table/Pagination';
import { HeaderCell } from '@oversikt/table/oppgaverTable/HeaderCell';
import { IngenMatchendeFiltre } from '@oversikt/table/oppgaverTable/IngenMatchendeFiltre';
import { Oppgaveliste } from '@oversikt/table/oppgaverTable/oppgavelister/predefinerteOppgavelister';
import { OppgavelisterOppgaveRow } from '@oversikt/table/oppgaverTable/tilGodkjenning/OppgavelisterOppgaveRow';
import { useOppgavelisteFeed, useOppgavelisteSokSkjema, useSubmitOppgavelisteSok } from '@state/oppgavelister';
import { cn } from '@utils/tw';

import { OppgavelisteCombobox } from './OppgavelisteCombobox';
import { OppgavelisteDatoFilter } from './OppgavelisteDatoFilter';

const Oppgaverader = ({
    aktivOppgaveliste,
    oppgaver,
}: {
    aktivOppgaveliste: Oppgaveliste | null;
    oppgaver?: ApiOppgaveProjeksjon[];
}): ReactElement => {
    if (aktivOppgaveliste === null) {
        return (
            <Table.Row>
                <Table.DataCell colSpan={4}>Velg en oppgaveliste og trykk «Hent oppgaver»</Table.DataCell>
                <Table.DataCell colSpan={1} />
            </Table.Row>
        );
    }

    if (oppgaver === undefined || oppgaver.length === 0) {
        return <IngenMatchendeFiltre />;
    }

    return (
        <>
            {oppgaver.map((oppgave) => (
                <OppgavelisterOppgaveRow key={oppgave.id} oppgave={oppgave} />
            ))}
        </>
    );
};

const Oppgavelisteinnhold = (): ReactElement => {
    const { oppgaver, antallOppgaver, error, loading, aktivOppgaveliste } = useOppgavelisteFeed();
    const harIkkeHentetOppgaverForGjeldendeQuery = oppgaver === undefined && loading;

    useLoadingToast({ isLoading: harIkkeHentetOppgaverForGjeldendeQuery, message: 'Henter oppgaver' });

    if (harIkkeHentetOppgaverForGjeldendeQuery) {
        return <BehandletIdagTableSkeleton />;
    }

    if (error) {
        return <OppgaverTableError />;
    }

    return (
        <>
            <div
                className={cn(
                    'flex-1 overflow-auto p-0 text-ax-text-neutral [scrollbar-width:none]',
                    loading && '[&_tbody]:opacity-60 [&_tbody]:transition-opacity',
                )}
            >
                <div className="m-0 h-[calc(100%-50px)] w-full p-0">
                    <Table aria-label={aktivOppgaveliste?.navn ?? 'Oppgavelister'} zebraStripes>
                        <Table.Header>
                            <Table.Row>
                                <HeaderCell text="Saksbehandler" />
                                <Table.DataCell rowSpan={2} />
                                <HeaderCell text="Startdato" />
                                <HeaderCell text="Oppgave klar" />
                                <Table.DataCell rowSpan={2} aria-label="valg" />
                                <Table.DataCell rowSpan={2} aria-label="notater" />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Oppgaverader aktivOppgaveliste={aktivOppgaveliste} oppgaver={oppgaver} />
                        </Table.Body>
                    </Table>
                </div>
            </div>
            <Pagination antallOppgaver={antallOppgaver} />
        </>
    );
};

export const OppgavelisterTable = (): ReactElement => {
    const { valgtOppgaveliste } = useOppgavelisteSokSkjema();
    const submitSøk = useSubmitOppgavelisteSok();

    const comboboxRef = useRef<HTMLInputElement>(null);
    const [visValideringsfeil, setVisValideringsfeil] = useState(false);
    const manglerOppgaveliste = valgtOppgaveliste === null;
    const visFeilmelding = visValideringsfeil && manglerOppgaveliste;

    return (
        <VStack className="h-full overflow-auto">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (manglerOppgaveliste) {
                        setVisValideringsfeil(true);
                        comboboxRef.current?.focus();
                        return;
                    }
                    setVisValideringsfeil(false);
                    submitSøk();
                }}
            >
                <HStack wrap gap="space-16" align="end" marginInline="space-12" marginBlock="space-12 space-8">
                    <OppgavelisteCombobox ref={comboboxRef} harFeil={visFeilmelding} />
                    <OppgavelisteDatoFilter />
                    <Button type="submit" size="small">
                        Hent oppgaver
                    </Button>
                </HStack>
                <Box aria-live="polite" marginInline="space-12" marginBlock="space-0 space-8">
                    {visFeilmelding && (
                        <ErrorMessage size="small" showIcon>
                            Du må velge en oppgaveliste
                        </ErrorMessage>
                    )}
                </Box>
            </form>
            <Oppgavelisteinnhold />
        </VStack>
    );
};
