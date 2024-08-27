import dayjs from 'dayjs';
import React from 'react';
import { Controller } from 'react-hook-form';

import { DatePicker } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';
import styles from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/Refusjon.module.scss';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

interface FomPickerProps {
    name: string;
    fom?: string;
    tom?: Maybe<string>;
    error: boolean;
    onSelect: (date: Date | undefined) => void;
    clearErrors: () => void;
    updateFom: (nyFom: string) => void;
}

export const FomPicker = ({ name, fom, tom, error, onSelect, clearErrors, updateFom }: FomPickerProps) => (
    <DatePicker
        defaultSelected={fom ? dayjs(fom, ISO_DATOFORMAT).toDate() : undefined}
        // @ts-expect-error Det er noe muffins med date picker, hold ds oppdatert i håp om at feilen løses
        defaultMonth={
            fom ? (dayjs(fom, ISO_DATOFORMAT).isValid() ? dayjs(fom, ISO_DATOFORMAT).toDate() : undefined) : undefined
        }
        onSelect={(date: Date | undefined) => {
            onSelect(date);
        }}
    >
        <Controller
            name={name}
            rules={{
                required: false,
                validate: {
                    måHaGyldigFormat: (value) =>
                        dayjs(value, ISO_DATOFORMAT).isValid() || 'Datoen må ha format dd.mm.åååå',
                    fomKanIkkeværeEtterTom: (value) =>
                        tom === null || dayjs(value).isSameOrBefore(tom) || 'Fom kan ikke være etter tom',
                },
            }}
            render={() => (
                <DatePicker.Input
                    label="fom"
                    hideLabel
                    className={styles.DateInput}
                    size="small"
                    placeholder="dd.mm.åååå"
                    onBlur={(e) => {
                        const nyFom = dayjs(e.target.value, NORSK_DATOFORMAT).isValid()
                            ? dayjs(e.target.value, NORSK_DATOFORMAT).format(ISO_DATOFORMAT)
                            : e.target.value;

                        if (nyFom === fom) return;
                        clearErrors();

                        updateFom(nyFom);
                    }}
                    defaultValue={
                        fom && dayjs(fom, ISO_DATOFORMAT).isValid()
                            ? dayjs(fom, ISO_DATOFORMAT)?.format(NORSK_DATOFORMAT)
                            : fom
                    }
                    error={error}
                />
            )}
        />
    </DatePicker>
);
