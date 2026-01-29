import React, { ReactElement } from 'react';

import { Checkbox } from '@navikt/ds-react';

import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import styles from './MarkerAlleDagerCheckbox.module.css';

interface MarkerAlleDagerCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> {
    alleDager: Map<string, Utbetalingstabelldag>;
    markerteDager: Map<string, Utbetalingstabelldag>;
    setMarkerteDager: (dager: Map<string, Utbetalingstabelldag>) => void;
}

export const MarkerAlleDagerCheckbox = ({
    alleDager,
    markerteDager,
    setMarkerteDager,
    ...rest
}: MarkerAlleDagerCheckboxProps): ReactElement => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setMarkerteDager(alleDager);
        } else {
            setMarkerteDager(new Map());
        }
    };

    return (
        <div className={styles.MarkerAlleDagerCheckbox}>
            <Checkbox
                onChange={onChange}
                checked={alleDager.size === markerteDager.size}
                {...rest}
                hideLabel
                size="small"
            >
                Marker alle dager
            </Checkbox>
        </div>
    );
};
