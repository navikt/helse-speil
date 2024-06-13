import classNames from 'classnames';
import React, { Dispatch, ReactElement, SetStateAction } from 'react';

import { Checkbox } from '@navikt/ds-react';

import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import styles from './MarkerAlleDagerCheckbox.module.css';

interface MarkerAlleDagerCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> {
    alleDager: Map<string, Utbetalingstabelldag>;
    markerteDager: Map<string, Utbetalingstabelldag>;
    setMarkerteDager: Dispatch<SetStateAction<Map<string, Utbetalingstabelldag>>>;
}

export const MarkerAlleDagerCheckbox = ({
    alleDager,
    markerteDager,
    setMarkerteDager,
    ...rest
}: MarkerAlleDagerCheckboxProps): ReactElement => {
    const hasSelectedSome = markerteDager.size > 0 && markerteDager.size !== alleDager.size;

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
                className={classNames(styles.Checkbox, hasSelectedSome && styles.partial)}
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
