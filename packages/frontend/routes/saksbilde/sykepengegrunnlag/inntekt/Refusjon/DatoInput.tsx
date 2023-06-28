import dayjs from 'dayjs';
import React from 'react';
import { FieldError } from 'react-hook-form';

import { UNSAFE_DatePicker as DatePicker } from '@navikt/ds-react';

import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

import styles from './Refusjon.module.css';

interface DatoInputProps {
    updateDato: (dato: Maybe<string>) => void;
    clearError: () => void;
    dato?: Maybe<string>;
    error?: FieldError;
}

export const DatoInput = ({ updateDato, clearError, dato, error }: DatoInputProps) => (
    <DatePicker.Input
        label=""
        className={styles.DateInput}
        size="small"
        placeholder="dd.mm.åååå"
        onBlur={(e) => {
            const nyDato = dayjs(e.target.value, NORSK_DATOFORMAT).isValid()
                ? dayjs(e.target.value, NORSK_DATOFORMAT).format(ISO_DATOFORMAT)
                : e.target.value === ''
                ? null
                : e.target.value;
            if (nyDato === dato) return;

            clearError();
            updateDato(nyDato);
        }}
        defaultValue={
            dato && dayjs(dato, ISO_DATOFORMAT).isValid()
                ? dayjs(dato, ISO_DATOFORMAT)?.format(NORSK_DATOFORMAT)
                : dato ?? undefined
        }
        error={error?.message}
    />
);
