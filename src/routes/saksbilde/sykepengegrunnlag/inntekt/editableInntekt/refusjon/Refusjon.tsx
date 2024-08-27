import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { Controller, FieldError, FieldErrorsImpl, Merge, useFormContext } from 'react-hook-form';

import { BodyShort, DatePicker, ErrorMessage } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Button } from '@components/Button';
import { Kildetype, Maybe } from '@io/graphql';
import { RefusjonKilde } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/RefusjonKilde';
import { Refusjonsopplysning } from '@typer/overstyring';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';
import { avrundetToDesimaler, isNumeric } from '@utils/tall';

import { RefusjonFormFields, RefusjonFormValues, useRefusjonFormField } from './useRefusjonFormField';

import styles from './Refusjon.module.scss';

interface RefusjonProps {
    fraRefusjonsopplysninger: Refusjonsopplysning[];
    lokaleRefusjonsopplysninger: Refusjonsopplysning[];
}

export const Refusjon = ({ fraRefusjonsopplysninger, lokaleRefusjonsopplysninger }: RefusjonProps) => {
    const {
        fields,
        addRefusjonsopplysning,
        removeRefusjonsopplysning,
        replaceRefusjonsopplysninger,
        updateRefusjonsopplysninger,
    } = useRefusjonFormField();
    const { formState, clearErrors } = useFormContext<RefusjonFormValues>();

    useEffect(() => {
        replaceRefusjonsopplysninger(
            lokaleRefusjonsopplysninger.length > 0 ? lokaleRefusjonsopplysninger : fraRefusjonsopplysninger,
        );
    }, []);

    return (
        <div className={styles.RefusjonWrapper} id="refusjonsopplysninger">
            <Bold>Refusjon</Bold>

            <div className={styles.RefusjonsHeading}>
                <div>Fra og med dato</div>
                <div>Til og med dato</div>
                <div>Månedlig refusjon</div>
            </div>
            {fields.map((refusjonsopplysning, index) => (
                <div key={refusjonsopplysning.id}>
                    <div className={styles.RefusjonsRad} data-testid="refusjonsopplysningrad">
                        <FomPicker
                            name={`refusjonsopplysninger.${index}.fom`}
                            fom={refusjonsopplysning.fom}
                            tom={refusjonsopplysning.tom}
                            error={!!formState.errors?.refusjonsopplysninger?.[index]?.fom?.message}
                            onSelect={(date) => {
                                updateRefusjonsopplysninger(
                                    date ? dayjs(date).format(ISO_DATOFORMAT) : refusjonsopplysning.fom,
                                    refusjonsopplysning?.tom ?? null,
                                    refusjonsopplysning.beløp,
                                    index,
                                );
                            }}
                            clearErrors={() => clearErrors(`refusjonsopplysninger.${index}`)}
                            updateFom={(nyFom) => {
                                updateRefusjonsopplysninger(
                                    nyFom,
                                    refusjonsopplysning?.tom ?? null,
                                    refusjonsopplysning.beløp,
                                    index,
                                );
                            }}
                        />
                        <TomPicker
                            name={`refusjonsopplysninger.${index}.tom`}
                            fom={refusjonsopplysning.fom}
                            tom={refusjonsopplysning.tom}
                            error={!!formState.errors?.refusjonsopplysninger?.[index]?.tom?.message}
                            onSelect={(date) => {
                                updateRefusjonsopplysninger(
                                    refusjonsopplysning?.fom ?? null,
                                    date ? dayjs(date).format(ISO_DATOFORMAT) : (refusjonsopplysning?.tom ?? null),
                                    refusjonsopplysning.beløp,
                                    index,
                                );
                            }}
                            clearErrors={() => clearErrors(`refusjonsopplysninger.${index}`)}
                            updateTom={(nyTom) => {
                                updateRefusjonsopplysninger(
                                    refusjonsopplysning?.fom ?? null,
                                    nyTom,
                                    refusjonsopplysning.beløp,
                                    index,
                                );
                            }}
                        />
                        <RefusjonsBeløpInput
                            index={index}
                            refusjonsopplysning={refusjonsopplysning}
                            updateBeløp={(nyttBeløp) =>
                                updateRefusjonsopplysninger(
                                    refusjonsopplysning.fom,
                                    refusjonsopplysning?.tom ?? null,
                                    nyttBeløp,
                                    index,
                                )
                            }
                        />

                        <RefusjonKilde
                            kilde={refusjonsopplysning.kilde as Kildetype}
                            harLokaleOpplysninger={lokaleRefusjonsopplysninger.length > 0}
                            harEndringer={
                                JSON.stringify(lokaleRefusjonsopplysninger?.[index]) !==
                                JSON.stringify(fraRefusjonsopplysninger?.[index])
                            }
                        />

                        <Button
                            type="button"
                            onClick={removeRefusjonsopplysning(index)}
                            className={styles.Button}
                            style={{ justifySelf: 'flex-end' }}
                        >
                            <BodyShort>Slett</BodyShort>
                        </Button>
                    </div>

                    <Feiloppsummering error={formState.errors.refusjonsopplysninger?.[`${index}`]} />
                </div>
            ))}
            <div className={styles.labelContainer}>
                <Button
                    type="button"
                    onClick={addRefusjonsopplysning}
                    className={styles.Button}
                    style={{ marginTop: 0 }}
                >
                    <BodyShort>+ Legg til</BodyShort>
                </Button>
            </div>
        </div>
    );
};

interface RefusjonsBeløpInputProps {
    index: number;
    refusjonsopplysning: Refusjonsopplysning;
    updateBeløp: (nyttBeløp: number) => void;
}

const RefusjonsBeløpInput = ({ index, refusjonsopplysning, updateBeløp }: RefusjonsBeløpInputProps) => {
    const {
        register,
        clearErrors,
        formState: {
            errors: { refusjonsopplysninger },
        },
    } = useFormContext<RefusjonFormValues>();
    const { ref, onBlur, ...inputValidation } = register(`refusjonsopplysninger.${index}.beløp`, {
        required: 'Refusjonsopplysningsbeløp mangler',
        min: { value: 0, message: 'Refusjonsopplysningsbeløp må være 0 eller større' },
        validate: {
            måVæreNumerisk: (value) => isNumeric(value.toString()) || 'Refusjonsbeløp må være et beløp',
        },
        setValueAs: (value) => Number(value.toString().replaceAll(' ', '').replaceAll(',', '.')),
    });

    return (
        <>
            <label id={`refusjonsopplysninger.${index}.beløp`} className="navds-sr-only">
                Månedlig refusjon
            </label>
            <input
                className={`${styles.BeløpInput} ${
                    refusjonsopplysninger?.[index]?.beløp?.message ? styles.InputError : ''
                }`}
                ref={ref}
                aria-labelledby={`refusjonsopplysninger.${index}.beløp`}
                defaultValue={refusjonsopplysning.beløp && avrundetToDesimaler(refusjonsopplysning.beløp)}
                onBlur={(event) => {
                    const nyttBeløp = Number(event.target.value.replaceAll(' ', '').replaceAll(',', '.'));

                    if (nyttBeløp === refusjonsopplysning.beløp) return;

                    clearErrors(`refusjonsopplysninger.${index}`);
                    updateBeløp(nyttBeløp);
                    void onBlur(event);
                }}
                {...inputValidation}
            />
        </>
    );
};

interface TomPickerProps {
    name: string;
    fom?: string;
    tom?: Maybe<string>;
    error: boolean;
    onSelect: (date: Date | undefined) => void;
    clearErrors: () => void;
    updateTom: (nyTom: Maybe<string>) => void;
}

const TomPicker = ({ name, fom, tom, error, onSelect, clearErrors, updateTom }: TomPickerProps) => {
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

interface FomPickerProps {
    name: string;
    fom?: string;
    tom?: Maybe<string>;
    error: boolean;
    onSelect: (date: Date | undefined) => void;
    clearErrors: () => void;
    updateFom: (nyFom: string) => void;
}

const FomPicker = ({ name, fom, tom, error, onSelect, clearErrors, updateFom }: FomPickerProps) => (
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

interface FeiloppsummeringProps {
    error: Merge<FieldError, FieldErrorsImpl<RefusjonFormFields>> | undefined;
}

const Feiloppsummering = ({ error }: FeiloppsummeringProps) =>
    error != null ? (
        <>
            {error?.fom && <ErrorMessage>{error.fom.message}</ErrorMessage>}
            {error?.tom && <ErrorMessage>{error.tom.message}</ErrorMessage>}
            {error?.beløp && <ErrorMessage>{error.beløp.message}</ErrorMessage>}
        </>
    ) : null;
