import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { Oppgave } from '@oversikt/table/oppgaverTable/util';
import { NORSK_DATOFORMAT, somDato } from '@utils/date';
import { cn } from '@utils/tw';

interface PåVentDatoCellProps {
    oppgave: ApiOppgaveProjeksjon;
}

export function PåVentDatoCell({ oppgave }: PåVentDatoCellProps): ReactElement {
    const utgåttFrist = Oppgave.erTidsfristUtgått(oppgave);
    return (
        <Table.DataCell className={cn('w-35', utgåttFrist && 'text-ax-text-danger-subtle')}>
            {oppgave.påVentInfo?.tidsfrist != null && somDato(oppgave.påVentInfo.tidsfrist).format(NORSK_DATOFORMAT)}
        </Table.DataCell>
    );
}
