import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { Tag } from '@navikt/ds-react';

import { ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date';
import { cn } from '@utils/tw';

import { EkspanderbartVarsel } from './EkspanderbartVarsel';
import { Varsel, varselfarge } from './Varsel';
import { Varselseksjon } from './Varselseksjon';
import { VarselstatusType } from './Varsler';

interface VarselMedHandlingProps {
    varsel: ApiVarselDTO;
    type: VarselstatusType;
}

export function VarselMedHandling({ varsel, type }: VarselMedHandlingProps): ReactElement {
    return (
        <EkspanderbartVarsel>
            <EkspanderbartVarsel.Header className={cn('border-b py-0 ps-0 text-ax-text-neutral', varselfarge[type])}>
                <Varsel className="min-h-18 self-stretch" varsel={varsel} type={type} />
            </EkspanderbartVarsel.Header>
            <EkspanderbartVarsel.Content className={cn('px-13 data-[open=true]:border-b', varselfarge[type])}>
                <Varselseksjon tittel="Hva betyr det?">{varsel.forklaring}</Varselseksjon>
                <Varselseksjon tittel="Hva gjør du?">{varsel.handling}</Varselseksjon>
                <Tag variant="neutral" className="mb-2">
                    Opprettet: {dayjs(varsel.opprettet).format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}
                </Tag>
            </EkspanderbartVarsel.Content>
        </EkspanderbartVarsel>
    );
}
