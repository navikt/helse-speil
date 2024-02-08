import React from 'react';

import { Checkbox } from '@navikt/ds-react';

import styles from './RadmarkeringCheckbox.module.css';

interface RadmarkeringCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> {
    index: number;
}

export const RadmarkeringCheckbox: React.FC<RadmarkeringCheckboxProps> = ({ index, ...rest }) => {
    return (
        <div className={styles.container}>
            <Checkbox {...rest} hideLabel>
                Velg rad {index + 1} for endring
            </Checkbox>
        </div>
    );
};
