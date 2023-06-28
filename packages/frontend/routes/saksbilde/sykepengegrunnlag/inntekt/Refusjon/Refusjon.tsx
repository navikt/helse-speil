import { BeløpInput } from './BeløpInput';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { UNSAFE_DatePicker as DatePicker, Fieldset } from '@navikt/ds-react';

import { Refusjonsopplysning } from '@io/http';
import { ISO_DATOFORMAT } from '@utils/date';

import { DatoInput } from './DatoInput';
import { KildeInput } from './KildeInput';
import { LeggTilRefusjonsopplysningKnapp } from './LeggTilRefusjonsopplysningKnapp';
import { SlettRefusjonsopplysningKnapp } from './SlettRefusjonsopplysningKnapp';
import { useRefusjonFormField } from './useRefusjonFormField';

import styles from './Refusjon.module.css';

interface RefusjonProps {
    fraRefusjonsopplysninger: Refusjonsopplysning[];
    lokaleRefusjonsopplysninger: Refusjonsopplysning[];
}

export const Refusjon = ({ fraRefusjonsopplysninger, lokaleRefusjonsopplysninger }: RefusjonProps) => {
    const {
        fields,
        control,
        clearErrors,
        formState,
        addRefusjonsopplysning,
        removeRefusjonsopplysning,
        replaceRefusjonsopplysninger,
        updateRefusjonsopplysninger,
    } = useRefusjonFormField();

    useEffect(() => {
        replaceRefusjonsopplysninger(
            lokaleRefusjonsopplysninger.length > 0 ? lokaleRefusjonsopplysninger : fraRefusjonsopplysninger,
        );
    }, []);

    const isNumeric = (input: string) => /^\d+(\.\d{1,2})?$/.test(input);

    return (
        <Fieldset legend="Refusjon" id="refusjonsopplysninger" className={styles.RefusjonWrapper}>
            <div className={styles.RefusjonsHeading}>
                <div>Fra og med dato</div>
                <div>Til og med dato</div>
                <div>Refusjonsbeløp</div>
            </div>
            {fields.map((refusjonsopplysning, index) => (
                <div key={refusjonsopplysning.id} className={styles.RefusjonsRad}>
                    <DatePicker
                        defaultSelected={
                            refusjonsopplysning?.fom
                                ? dayjs(refusjonsopplysning?.fom, ISO_DATOFORMAT).toDate()
                                : undefined
                        }
                        // @ts-expect-error Det er noe muffins med date picker, hold ds oppdatert i håp om at feilen løses
                        defaultMonth={
                            refusjonsopplysning?.fom
                                ? dayjs(refusjonsopplysning?.fom, ISO_DATOFORMAT).isValid()
                                    ? dayjs(refusjonsopplysning?.fom, ISO_DATOFORMAT).toDate()
                                    : undefined
                                : undefined
                        }
                        onSelect={(date: Date | undefined) => {
                            updateRefusjonsopplysninger(
                                date ? dayjs(date).format(ISO_DATOFORMAT) : refusjonsopplysning.fom,
                                refusjonsopplysning?.tom ?? null,
                                refusjonsopplysning.beløp,
                                index,
                            );
                        }}
                    >
                        <Controller
                            control={control}
                            name={`refusjonsopplysninger.${index}.fom`}
                            rules={{
                                required: false,
                                validate: {
                                    måHaGyldigFormat: (value) =>
                                        dayjs(value, ISO_DATOFORMAT).isValid() || 'Datoen må ha format dd.mm.åååå',
                                    fomKanIkkeværeEtterTom: (value) =>
                                        refusjonsopplysning.tom === null ||
                                        dayjs(value).isSameOrBefore(refusjonsopplysning.tom) ||
                                        'Fom kan ikke være etter tom',
                                },
                            }}
                            render={() => (
                                <DatoInput
                                    updateDato={(date: Maybe<string>) =>
                                        updateRefusjonsopplysninger(
                                            refusjonsopplysning?.fom ?? null,
                                            date,
                                            refusjonsopplysning.beløp,
                                            index,
                                        )
                                    }
                                    clearError={() => clearErrors(`refusjonsopplysninger.${index}`)}
                                    dato={refusjonsopplysning.fom}
                                    error={formState.errors?.refusjonsopplysninger?.[index]?.fom}
                                />
                            )}
                        />
                    </DatePicker>
                    <DatePicker
                        defaultSelected={
                            refusjonsopplysning?.tom
                                ? dayjs(refusjonsopplysning?.tom, ISO_DATOFORMAT).toDate()
                                : undefined
                        }
                        // @ts-expect-error Det er noe muffins med date picker, hold ds oppdatert i håp om at feilen løses
                        defaultMonth={
                            refusjonsopplysning?.tom
                                ? dayjs(refusjonsopplysning?.tom, ISO_DATOFORMAT).isValid()
                                    ? dayjs(refusjonsopplysning?.tom, ISO_DATOFORMAT).toDate()
                                    : undefined
                                : undefined
                        }
                        onSelect={(date: Date | undefined) => {
                            updateRefusjonsopplysninger(
                                refusjonsopplysning?.fom ?? null,
                                date ? dayjs(date).format(ISO_DATOFORMAT) : refusjonsopplysning?.tom ?? null,
                                refusjonsopplysning.beløp,
                                index,
                            );
                        }}
                    >
                        <Controller
                            control={control}
                            name={`refusjonsopplysninger.${index}.tom`}
                            rules={{
                                required: false,
                                validate: {
                                    måHaGyldigFormat: (value) =>
                                        refusjonsopplysning.tom === null ||
                                        dayjs(value, ISO_DATOFORMAT).isValid() ||
                                        'Datoen må ha format dd.mm.åååå',
                                    tomKanIkkeværeFørFom: (value) =>
                                        refusjonsopplysning.tom === null ||
                                        dayjs(value).isSameOrAfter(refusjonsopplysning.fom) ||
                                        'Tom kan ikke være før fom',
                                },
                            }}
                            render={() => (
                                <DatoInput
                                    updateDato={(date: Maybe<string>) =>
                                        updateRefusjonsopplysninger(
                                            refusjonsopplysning?.fom ?? null,
                                            date,
                                            refusjonsopplysning.beløp,
                                            index,
                                        )
                                    }
                                    clearError={() => clearErrors(`refusjonsopplysninger.${index}`)}
                                    dato={refusjonsopplysning.tom}
                                    error={formState.errors?.refusjonsopplysninger?.[index]?.tom}
                                />
                            )}
                        />
                    </DatePicker>
                    <Controller
                        control={control}
                        name={`refusjonsopplysninger.${index}.beløp`}
                        rules={{
                            required: true,
                            validate: {
                                måVæreNumerisk: (value) =>
                                    isNumeric(value.toString()) || 'Refusjonsbeløp må være et beløp',
                            },
                        }}
                        render={() => (
                            <BeløpInput
                                beløp={refusjonsopplysning.beløp}
                                updateBeløp={(beløp: number) =>
                                    updateRefusjonsopplysninger(
                                        refusjonsopplysning.fom,
                                        refusjonsopplysning?.tom ?? null,
                                        beløp,
                                        index,
                                    )
                                }
                                clearError={() => clearErrors(`refusjonsopplysninger.${index}`)}
                                error={formState.errors?.refusjonsopplysninger?.[index]?.beløp}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name={`refusjonsopplysninger.${index}.kilde`}
                        render={() => (
                            <KildeInput
                                kilde={refusjonsopplysning.kilde}
                                fraRefusjonsopplysning={fraRefusjonsopplysninger?.[index]}
                                lokalRefusjonsopplysning={lokaleRefusjonsopplysninger?.[index]}
                            />
                        )}
                    />
                    <SlettRefusjonsopplysningKnapp onClick={removeRefusjonsopplysning(index)} />
                </div>
            ))}
            <div className={styles.labelContainer}>
                <LeggTilRefusjonsopplysningKnapp onClick={addRefusjonsopplysning} />
            </div>
        </Fieldset>
    );
};
