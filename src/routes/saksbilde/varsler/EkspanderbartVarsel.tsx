import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { Accordion, Tag } from '@navikt/ds-react';

import { VarselDto } from '@io/graphql';
import { NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date';

import { Varsel } from './Varsel';
import { Varselseksjon } from './Varselseksjon';
import { VarselstatusType } from './Varsler';

import styles from './EkspanderbartVarsel.module.css';

interface EkspanderbartVarselProps {
    varsel: VarselDto;
    type: VarselstatusType;
}

export const EkspanderbartVarsel: React.FC<EkspanderbartVarselProps> = ({ varsel, type }) => {
    const [open, setOpen] = useState(false);

    return (
        <Accordion>
            <Accordion.Item defaultOpen={open} className={classNames(styles.ekspanderbartVarsel, styles[type])}>
                <Accordion.Header onClick={() => setOpen(!open)}>
                    <Varsel className={styles.varsel} varsel={varsel} type={type} />
                </Accordion.Header>
                <Accordion.Content className={classNames(styles.content, styles[type])}>
                    <Varselseksjon tittel="Hva betyr det?">{varsel.forklaring}</Varselseksjon>
                    <Varselseksjon tittel="Hva gjør du?">{varsel.handling}</Varselseksjon>
                    <Tag variant="neutral">
                        Opprettet: {dayjs(varsel.opprettet).format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}
                    </Tag>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};
