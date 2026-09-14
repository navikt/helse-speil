import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { Tag } from '@navikt/ds-react';

import { VarselDto } from '@io/graphql';
import { NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date';
import { cn } from '@utils/tw';

import { EkspanderbartVarsel } from './EkspanderbartVarsel';
import { Varsel } from './Varsel';
import { Varselseksjon } from './Varselseksjon';
import { VarselstatusType } from './Varsler';

import styles from './VarselMedHandling.module.css';

interface VarselMedHandlingProps {
    varsel: VarselDto;
    type: VarselstatusType;
}

export const VarselMedHandling = ({ varsel, type }: VarselMedHandlingProps): ReactElement => {
    return (
        <EkspanderbartVarsel>
            <EkspanderbartVarsel.Header className={cn(styles.header, styles[type])}>
                <Varsel className={styles.varsel} varsel={varsel} type={type} />
            </EkspanderbartVarsel.Header>
            <EkspanderbartVarsel.Content className={cn(styles.content, styles[type])}>
                <Varselseksjon tittel="Hva betyr det?">{varsel.forklaring}</Varselseksjon>
                <Varselseksjon tittel="Hva gjør du?">{varsel.handling}</Varselseksjon>
                <Tag variant="neutral" className={styles.tag}>
                    Opprettet: {dayjs(varsel.opprettet).format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}
                </Tag>
            </EkspanderbartVarsel.Content>
        </EkspanderbartVarsel>
    );
};
