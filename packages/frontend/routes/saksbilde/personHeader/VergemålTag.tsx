import React from 'react';

import { Tag, Tooltip } from '@navikt/ds-react';

import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';

import styles from './PersonHeader.module.css';

export const VergemålTag: React.FC = () => {
    const periodeTilGodkjenning = usePeriodeTilGodkjenning();
    if (!periodeTilGodkjenning) return null;

    const harVergemål = periodeTilGodkjenning.varsler.find((varsel) => varsel.kode === 'SB_EX_4');
    if (harVergemål) {
        return (
            <Tooltip content="Den sykmeldte er under vergemål" maxChar={120}>
                <Tag variant="warning" size="small" className={styles.Tag}>
                    Vergemål
                </Tag>
            </Tooltip>
        );
    }

    return null;
};
