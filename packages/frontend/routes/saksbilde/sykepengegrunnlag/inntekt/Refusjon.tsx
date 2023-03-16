import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort, UNSAFE_DatePicker as DatePicker } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Button } from '@components/Button';
import { Endringstrekant } from '@components/Endringstrekant';
import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { Kildetype } from '@io/graphql';
import { Refusjonsopplysning } from '@io/http';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

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
            lokaleRefusjonsopplysninger.length > 0 ? lokaleRefusjonsopplysninger : fraRefusjonsopplysninger
        );
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
                                        const nyFom = dayjs(e.target.value, NORSK_DATOFORMAT).isValid()
                                            ? dayjs(e.target.value, NORSK_DATOFORMAT).format(ISO_DATOFORMAT)
                                            : e.target.value;

                                        if (nyFom === refusjonsopplysning.fom) return;
                                        clearErrors(`refusjonsopplysninger.${index}`);

                                        updateRefusjonsopplysninger(
                                            nyFom,
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
                            render={() => (
                                <DatePicker.Input
                                    label=""
                                    className={styles.DateInput}
                                    size="small"
                                    placeholder="dd.mm.åååå"
                                    onBlur={(e) => {
                                        const nyTom = dayjs(e.target.value, NORSK_DATOFORMAT).isValid()
                                            ? dayjs(e.target.value, NORSK_DATOFORMAT).format(ISO_DATOFORMAT)
                                            : e.target.value === ''
                                            ? null
                                            : e.target.value;
                                        if (nyTom === refusjonsopplysning.tom) return;

                                        clearErrors(`refusjonsopplysninger.${index}`);
                                        updateRefusjonsopplysninger(
                                            refusjonsopplysning?.fom ?? null,
                                            nyTom,
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
                        render={() => (
                            <input
                                className={`${styles.BeløpInput} ${
                                    formState.errors?.refusjonsopplysninger?.[index]?.beløp?.message
                                        ? styles.InputError
                                        : ''
                                }`}
                                type="number"
                                onBlur={(event) => {
                                    const nyttBeløp = Number(event.target.value);

                                    if (nyttBeløp === refusjonsopplysning.beløp) return;

                                    clearErrors(`refusjonsopplysninger.${index}`);
                                    updateRefusjonsopplysninger(
                                        refusjonsopplysning.fom,
                                        refusjonsopplysning?.tom ?? null,
                                        Number(event.target.value),
                                        index
                                    );
                                }}
                                defaultValue={
                                    refusjonsopplysning.beløp &&
                                    Math.round((refusjonsopplysning.beløp + Number.EPSILON) * 100) / 100
                                }
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name={`refusjonsopplysninger.${index}.kilde`}
                        render={() => (
                            <Flex alignItems="center">
                                {refusjonsopplysning.kilde === Kildetype.Inntektsmelding && (
                                    <Kilde type={refusjonsopplysning.kilde} className={styles.Ikon}>
                                        IM
                                    </Kilde>
                                )}
                                {refusjonsopplysning.kilde === Kildetype.Saksbehandler &&
                                    (lokaleRefusjonsopplysninger.length > 0 &&
                                    JSON.stringify(lokaleRefusjonsopplysninger?.[index]) !==
                                        JSON.stringify(fraRefusjonsopplysninger?.[index]) ? (
                                        <div style={{ position: 'relative', width: '20px' }}>
                                            <Endringstrekant />
                                        </div>
                                    ) : (
                                        <Kilde type={refusjonsopplysning.kilde} className={styles.Ikon}>
                                            <CaseworkerFilled height={12} width={12} />
                                        </Kilde>
                                    ))}
                            </Flex>
                        )}
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

interface RefusjonFormValues {
    name: string;
    refusjonsopplysninger: { fom: string; tom?: Maybe<string>; beløp: number; kilde: string }[];
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
            tom: null,
            beløp: 0,
            kilde: Kildetype.Saksbehandler,
        });
    };

    const removeRefusjonsopplysning = (index: number) => () => {
        remove(index);
    };

    const replaceRefusjonsopplysninger = (refusjonsopplysninger: Refusjonsopplysning[]) => {
        replace(
            refusjonsopplysninger
                .sort(
                    (a: Refusjonsopplysning, b: Refusjonsopplysning) =>
                        new Date(b.fom).getTime() - new Date(a.fom).getTime()
                )
                .map((refusjonsopplysning) => {
                    return {
                        ...refusjonsopplysning,
                        beløp: Math.round((refusjonsopplysning.beløp + Number.EPSILON) * 100) / 100,
                    };
                })
        );
    };

    const updateRefusjonsopplysninger = (
        fom: string,
        tom: Maybe<string>,
        beløp: number,
        index: number,
        kilde = Kildetype.Saksbehandler
    ) => {
        update(index, { fom, tom, beløp, kilde });
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
