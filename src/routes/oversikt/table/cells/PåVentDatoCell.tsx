import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { NORSK_DATOFORMAT, somDato } from '@utils/date';
import { cn } from '@utils/tw';

interface PåVentDatoCellProps {
    oppgave: ApiOppgaveProjeksjon;
    utgåttFrist: boolean;
}

export function PåVentDatoCell({ oppgave, utgåttFrist }: PåVentDatoCellProps): ReactElement {
    return (
        <Table.DataCell className={cn('w-35', utgåttFrist && 'text-ax-text-danger-subtle')}>
            {oppgave.paVentInfo?.tidsfrist ? somDato(oppgave.paVentInfo.tidsfrist).format(NORSK_DATOFORMAT) : null}
        </Table.DataCell>
    );
}
