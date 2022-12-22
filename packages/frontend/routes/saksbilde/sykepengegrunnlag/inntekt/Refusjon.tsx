import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort, UNSAFE_DatePicker as DatePicker } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Button } from '@components/Button';
import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { Inntektskilde, Kildetype } from '@io/graphql';
import { Refusjonsopplysning } from '@io/http';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

import styles from './Refusjon.module.css';

interface RefusjonProps {
    fraRefusjonsopplysninger: Refusjonsopplysning[];
}

export const Refusjon = ({ fraRefusjonsopplysninger }: RefusjonProps) => {
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
        replaceRefusjonsopplysninger(fraRefusjonsopplysninger.reverse());
    }, []);

    const isNumeric = (input: string) => /^\d+(\.\d{1,2})?$/.test(input);

    return (
        <div className={styles.RefusjonWrapper}>
            <Bold>Refusjon</Bold>

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
                        // TODO: Må oppgradere designsystemet til v2.0+ for å fjerne @ts-ignore
                        // @ts-ignore
                        defaultMonth={
                            refusjonsopplysning?.fom
                                ? dayjs(refusjonsopplysning?.fom, ISO_DATOFORMAT).toDate()
                                : undefined
                        }
                        onSelect={(date: Date | undefined) => {
                            updateRefusjonsopplysninger(
                                date ? dayjs(date).format(ISO_DATOFORMAT) : refusjonsopplysning.fom,
                                refusjonsopplysning?.tom ?? null,
                                refusjonsopplysning.beløp,
                                index
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
                            render={({ field: { value, onChange, onBlur } }) => (
                                <DatePicker.Input
                                    label=""
                                    className={styles.DateInput}
                                    size="small"
                                    placeholder="dd.mm.åååå"
                                    onBlur={(e) => {
                                        clearErrors(`refusjonsopplysninger.${index}`);
                                        updateRefusjonsopplysninger(
                                            dayjs(e.target.value, NORSK_DATOFORMAT).isValid()
                                                ? dayjs(e.target.value, NORSK_DATOFORMAT).format(ISO_DATOFORMAT)
                                                : e.target.value,
                                            refusjonsopplysning?.tom ?? null,
                                            refusjonsopplysning.beløp,
                                            index
                                        );
                                    }}
                                    defaultValue={
                                        refusjonsopplysning?.fom &&
                                        dayjs(refusjonsopplysning.fom, ISO_DATOFORMAT).isValid()
                                            ? dayjs(refusjonsopplysning.fom, ISO_DATOFORMAT)?.format(NORSK_DATOFORMAT)
                                            : refusjonsopplysning.fom
                                    }
                                    error={!!formState.errors?.refusjonsopplysninger?.[index]?.fom?.message}
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
                        // TODO: Må oppgradere designsystemet til v2.0+ for å fjerne @ts-ignore
                        // @ts-ignore
                        defaultMonth={
                            refusjonsopplysning?.tom
                                ? dayjs(refusjonsopplysning?.tom, ISO_DATOFORMAT).toDate()
                                : undefined
                        }
                        onSelect={(date: Date | undefined) => {
                            updateRefusjonsopplysninger(
                                refusjonsopplysning?.fom ?? null,
                                date ? dayjs(date).format(ISO_DATOFORMAT) : refusjonsopplysning?.tom ?? null,
                                refusjonsopplysning.beløp,
                                index
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
                            render={({ field: { value, onChange, onBlur } }) => (
                                <DatePicker.Input
                                    label=""
                                    className={styles.DateInput}
                                    size="small"
                                    placeholder="dd.mm.åååå"
                                    onBlur={(e) => {
                                        clearErrors(`refusjonsopplysninger.${index}`);
                                        updateRefusjonsopplysninger(
                                            refusjonsopplysning?.fom ?? null,
                                            dayjs(e.target.value, NORSK_DATOFORMAT).isValid()
                                                ? dayjs(e.target.value, NORSK_DATOFORMAT).format(ISO_DATOFORMAT)
                                                : e.target.value === ''
                                                ? null
                                                : e.target.value,
                                            refusjonsopplysning.beløp,
                                            index
                                        );
                                    }}
                                    defaultValue={
                                        refusjonsopplysning?.tom &&
                                        dayjs(refusjonsopplysning.tom, ISO_DATOFORMAT).isValid()
                                            ? dayjs(refusjonsopplysning.tom, ISO_DATOFORMAT)?.format(NORSK_DATOFORMAT)
                                            : refusjonsopplysning?.tom ?? undefined
                                    }
                                    error={!!formState.errors?.refusjonsopplysninger?.[index]?.tom?.message}
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
                        render={({ field: { value, onChange, onBlur } }) => (
                            <input
                                className={`${styles.BeløpInput} ${
                                    formState.errors?.refusjonsopplysninger?.[index]?.beløp?.message
                                        ? styles.InputError
                                        : ''
                                }`}
                                type="number"
                                onBlur={(event) => {
                                    clearErrors(`refusjonsopplysninger.${index}`);
                                    updateRefusjonsopplysninger(
                                        refusjonsopplysning.fom,
                                        refusjonsopplysning?.tom ?? null,
                                        Number(event.target.value),
                                        index
                                    );
                                }}
                                defaultValue={refusjonsopplysning.beløp}
                            />
                        )}
                    />
                    {fields[index].toString() === fraRefusjonsopplysninger.reverse()[index]?.toString() && (
                        <Flex alignItems="center">
                            <Kilde type={Kildetype.Inntektsmelding} className={styles.Ikon}>
                                IM
                            </Kilde>
                        </Flex>
                    )}
                    {fields[index].toString() !== fraRefusjonsopplysninger.reverse()[index]?.toString() && (
                        <Flex alignItems="center">
                            <Kilde type={Inntektskilde.Saksbehandler} className={styles.Ikon}>
                                <CaseworkerFilled height={12} width={12} />
                            </Kilde>
                        </Flex>
                    )}
                    <Button
                        type="button"
                        onClick={removeRefusjonsopplysning(index)}
                        className={styles.Button}
                        style={{ justifySelf: 'flex-end' }}
                    >
                        <BodyShort>Slett</BodyShort>
                    </Button>
                </div>
            ))}
            <div className={styles.labelContainer}>
                <Button type="button" onClick={addRefusjonsopplysning} className={styles.Button}>
                    <BodyShort>+ Legg til</BodyShort>
                </Button>
            </div>
        </div>
    );
};

interface RefusjonFormValues {
    name: string;
    refusjonsopplysninger: { fom: string; tom?: Maybe<string>; beløp: number }[];
}

function useRefusjonFormField() {
    const { formState, control, clearErrors } = useFormContext<RefusjonFormValues>();

    const { fields, append, remove, replace, update } = useFieldArray<RefusjonFormValues>({
        control,
        name: 'refusjonsopplysninger',
    });

    const addRefusjonsopplysning = () => {
        append({
            fom: '',
            tom: '',
            beløp: 0,
        });
    };

    const removeRefusjonsopplysning = (index: number) => () => {
        remove(index);
    };

    const replaceRefusjonsopplysninger = (refusjonsopplysninger: Refusjonsopplysning[]) => {
        replace(refusjonsopplysninger);
    };

    const updateRefusjonsopplysninger = (fom: string, tom: Maybe<string>, beløp: number, index: number) => {
        update(index, { fom, tom, beløp });
    };

    return {
        fields,
        control,
        clearErrors,
        formState,
        addRefusjonsopplysning,
        removeRefusjonsopplysning,
        replaceRefusjonsopplysninger,
        updateRefusjonsopplysninger,
    };
}