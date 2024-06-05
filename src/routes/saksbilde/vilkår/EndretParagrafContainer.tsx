import React from 'react';

import { BodyShort, Tooltip } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import { Advarselikon } from '@components/ikoner/Advarselikon';

import styles from './EndretParagrafContainer.module.css';

export const EndretParagrafContainer = () => (
    <span className={styles.Container}>
        <Tooltip content="Mellom 67 og 70 år - inntektsgrunnlaget må overstige 2G">
            <div className={styles.IkonContainer}>
                <Advarselikon alt="Mellom 67 og 70 år - inntektsgrunnlaget må overstige 2G" height={16} width={16} />
            </div>
        </Tooltip>
        <BodyShort className={styles.LovdataLenkeContainer}>
            <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
        </BodyShort>
    </span>
);
