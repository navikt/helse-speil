import dayjs from 'dayjs';
import React from 'react';
import { Controller } from 'react-hook-form';

import { DatePicker } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';
import styles from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/Refusjon.module.scss';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

interface TomPickerProps {
    name: string;
    fom?: string;
    tom?: Maybe<string>;
    error: boolean;
    onSelect: (date: Date | undefined) => void;
    clearErrors: () => void;
    updateTom: (nyTom: Maybe<string>) => void;
}

export const TomPicker = ({ name, fom, tom, error, onSelect, clearErrors, updateTom }: TomPickerProps) => {
    return (
        <DatePicker
            defaultSelected={tom ? dayjs(tom, ISO_DATOFORMAT).toDate() : undefined}
            // @ts-expect-error Det er noe muffins med date picker, hold ds oppdatert i håp om at feilen løses
            defaultMonth={
                tom
                    ? dayjs(tom, ISO_DATOFORMAT).isValid()
                        ? dayjs(tom, ISO_DATOFORMAT).toDate()
                        : undefined
                    : undefined
            }
            onSelect={(date: Date | undefined) => onSelect(date)}
        >
            <Controller
                name={name}
                rules={{
                    required: false,
                    validate: {
                        måHaGyldigFormat: (value) =>
                            tom === null || dayjs(value, ISO_DATOFORMAT).isValid() || 'Datoen må ha format dd.mm.åååå',
                        tomKanIkkeværeFørFom: (value) =>
                            tom === null || dayjs(value).isSameOrAfter(fom) || 'Tom kan ikke være før fom',
                    },
                }}
                render={() => (
                    <DatePicker.Input
                        label="tom"
                        hideLabel
                        className={styles.DateInput}
                        size="small"
                        placeholder="dd.mm.åååå"
                        onBlur={(e) => {
                            const nyTom = dayjs(e.target.value, NORSK_DATOFORMAT).isValid()
                                ? dayjs(e.target.value, NORSK_DATOFORMAT).format(ISO_DATOFORMAT)
                                : e.target.value === ''
                                  ? null
                                  : e.target.value;
                            if (nyTom === tom) return;

                            clearErrors();
                            updateTom(nyTom);
                        }}
                        defaultValue={
                            tom && dayjs(tom, ISO_DATOFORMAT).isValid()
                                ? dayjs(tom, ISO_DATOFORMAT)?.format(NORSK_DATOFORMAT)
                                : (tom ?? undefined)
                        }
                        error={error}
                    />
                )}
            />
        </DatePicker>
    );
};
