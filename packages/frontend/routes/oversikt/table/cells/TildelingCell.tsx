import React from 'react';

import { Table } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';

import { IkkeTildelt } from './IkkeTildelt';
import { Tildelt } from './Tildelt';

interface TildelingProps {
    oppgave: OppgaveTilBehandling;
    kanTildeles: boolean;
}

export const TildelingCell = ({ oppgave, kanTildeles }: TildelingProps) =>
    !kanTildeles ? (
        <Table.DataCell>
            <p style={{ width: 128 }} />
        </Table.DataCell>
    ) : (
        <Table.DataCell>
            {oppgave.tildeling ? (
                <Tildelt width={128} name={oppgave.tildeling.navn} />
            ) : (
                <IkkeTildelt width={128} oppgavereferanse={oppgave.id} aktørId={oppgave.aktorId} />
            )}
        </Table.DataCell>
    );
