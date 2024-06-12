import React, { ReactElement } from 'react';

import { Checkbox } from '@navikt/ds-react';

import styles from './RadmarkeringCheckbox.module.css';

interface RadmarkeringCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> {
    index: number;
}

export const RadmarkeringCheckbox = ({ index, ...rest }: RadmarkeringCheckboxProps): ReactElement => {
    return (
        <div className={styles.container}>
            <Checkbox {...rest} hideLabel size="small">
                Velg rad {index + 1} for endring
            </Checkbox>
        </div>
    );
};
