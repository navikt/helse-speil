import classNames from 'classnames';
import React from 'react';
import { FieldError } from 'react-hook-form';

import styles from './Refusjon.module.css';

interface BeløpInputProps {
    beløp: number;
    updateBeløp: (beløp: number) => void;
    clearError: () => void;
    error?: FieldError;
}

export const BeløpInput = ({ beløp, updateBeløp, clearError, error }: BeløpInputProps) => (
    <input
        className={classNames({
            [styles.BeløpInput]: true,
            [styles.InputError]: error?.message,
        })}
        type="number"
        onBlur={(event) => {
            const nyttBeløp = Number(event.target.value);
            if (nyttBeløp === beløp) return;
            clearError();
            updateBeløp(Number(event.target.value));
        }}
        defaultValue={beløp && Math.round((beløp + Number.EPSILON) * 100) / 100}
    />
);
