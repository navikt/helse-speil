import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { somPenger } from '@utils/locale';
import { cn } from '@utils/tw';

import styles from './SimuleringsperiodeView.module.css';

interface SimuleringsperiodeValueProps extends React.HTMLAttributes<HTMLElement> {
    label: string;
    value: string | number;
    isSensitive?: boolean;
}

export const SimuleringsperiodeValue = ({
    label,
    value,
    isSensitive,
    ...props
}: SimuleringsperiodeValueProps): ReactElement => {
    return (
        <>
            <BodyShort size="small" {...props}>
                {label}
            </BodyShort>
            <BodyShort
                size="small"
                data-sensitive={isSensitive || undefined}
                className={cn(styles.Bold, typeof value === 'number' && value < 0 && styles.NegativtBeløp)}
            >
                {typeof value === 'number' ? somPenger(value) : value}
            </BodyShort>
        </>
    );
};
