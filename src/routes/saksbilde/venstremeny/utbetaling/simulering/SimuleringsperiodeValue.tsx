import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { somPenger } from '@utils/locale';
import { cn } from '@utils/tw';

import styles from './SimuleringsperiodeView.module.css';

interface SimuleringsperiodeValueProps {
    label: string;
    value: string | number;
}

export const SimuleringsperiodeValue = ({ label, value }: SimuleringsperiodeValueProps): ReactElement => {
    return (
        <>
            <BodyShort size="small">{label}</BodyShort>
            <BodyShort
                size="small"
                className={cn(styles.Bold, typeof value === 'number' && value < 0 && styles.NegativtBeløp)}
            >
                {typeof value === 'number' ? somPenger(value) : value}
            </BodyShort>
        </>
    );
};
