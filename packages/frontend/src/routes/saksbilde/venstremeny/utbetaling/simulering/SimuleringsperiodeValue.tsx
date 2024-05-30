import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { somPenger } from '@utils/locale';

import styles from './SimuleringsperiodeView.module.css';

interface SimuleringsperiodeValueProps {
    label: string;
    value: string | number;
}

export const SimuleringsperiodeValue: React.FC<SimuleringsperiodeValueProps> = ({ label, value }) => {
    return (
        <>
            <BodyShort size="small">{label}</BodyShort>
            <BodyShort
                size="small"
                className={classNames(styles.Bold, typeof value === 'number' && value < 0 && styles.NegativtBeløp)}
            >
                {typeof value === 'number' ? somPenger(value) : value}
            </BodyShort>
        </>
    );
};
