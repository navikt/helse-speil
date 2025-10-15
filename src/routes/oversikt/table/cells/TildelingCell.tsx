import React, { MouseEvent, ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';

import { IkkeTildelt } from './IkkeTildelt';
import { Tildelt } from './Tildelt';

interface TildelingProps {
    oppgave: ApiOppgaveProjeksjon;
}

export const TildelingCell = ({ oppgave }: TildelingProps): ReactElement => (
    <Table.DataCell
        style={{ width: 180 }}
        onClick={(event: MouseEvent<HTMLTableCellElement>) => {
            if (!oppgave.tildeling) event.stopPropagation();
        }}
    >
        {oppgave.tildeling ? (
            <Tildelt width={180} name={oppgave.tildeling.navn} />
        ) : (
            <IkkeTildelt width={128} oppgavereferanse={oppgave.id} />
        )}
    </Table.DataCell>
);
