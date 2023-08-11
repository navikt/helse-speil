import React from 'react';

import { Tag, Tooltip } from '@navikt/ds-react';

import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';

import styles from './PersonHeader.module.css';

export const UtlandTag: React.FC = () => {
    const periodeTilGodkjenning = usePeriodeTilGodkjenning();
    if (!periodeTilGodkjenning) return null;

    const utlandVarsel = periodeTilGodkjenning.varsler.find((varsel) => varsel.kode === 'SB_EX_5');
    if (utlandVarsel) {
        return (
            <Tooltip content={utlandVarsel.tittel} maxChar={120}>
                <Tag variant="warning" size="medium" className={styles.Tag}>
                    Utland
                </Tag>
            </Tooltip>
        );
    }

    return null;
};
