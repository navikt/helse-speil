import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort, UNSAFE_DatePicker as DatePicker } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Button } from '@components/Button';
import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { Kildetype } from '@io/graphql';
import { Refusjonsopplysning } from '@io/http';
import { NORSK_DATOFORMAT } from '@utils/date';

import styles from './Refusjon.module.css';

interface RefusjonProps {
    fraRefusjonsopplysninger: Refusjonsopplysning[];
}

export const Refusjon = ({ fraRefusjonsopplysninger }: RefusjonProps) => {
    const {
        fields,
        register,
        addRefusjonsopplysning,
        removeRefusjonsopplysning,
        replaceRefusjonsopplysninger,
        updateRefusjonsopplysninger,
    } = useRefusjonFormField();

    useEffect(() => {
        replaceRefusjonsopplysninger(fraRefusjonsopplysninger.reverse());
    }, []);

    return (
        <div className={styles.RefusjonWrapper}>
            <Bold>Refusjon</Bold>

            <div className={styles.RefusjonsHeading}>
                <div>Fra og med dato</div>
                <div>Til og med dato</div>
                <div>Refusjonsbeløp</div>
            </div>
            {fields.map((field, index) => (
                <div key={field.id} className={styles.RefusjonsRad}>
                    <DatePicker
                        defaultSelected={new Date(field?.fom ?? '')}
                        onSelect={(date: Date | undefined) => {
                            updateRefusjonsopplysninger(
                                date ? dayjs(date).format('YYYY-MM-DD') : field.fom,
                                field?.tom ?? null,
                                field.beløp,
                                index
                            );
                        }}
                    >
                        <DatePicker.Input
                            label=""
                            className={styles.DateInput}
                            size="small"
                            defaultValue={field?.fom ? dayjs(field.fom).format(NORSK_DATOFORMAT) : ''}
                            placeholder="dd.mm.åååå"
                            onBlur={(e) => {
                                updateRefusjonsopplysninger(
                                    e.target.value !== ''
                                        ? dayjs(e.target.value, NORSK_DATOFORMAT).format('YYYY-MM-DD')
                                        : '',
                                    field?.tom ?? null,
                                    field.beløp,
                                    index
                                );
                            }}
                        />
                        {/*{...register(`refusjonsopplysninger.${index}.fom`)}*/}
                    </DatePicker>
                    <DatePicker
                        defaultSelected={field?.tom && field.tom !== '' ? new Date(field.tom) : undefined}
                        onSelect={(date: Date | undefined) => {
                            updateRefusjonsopplysninger(
                                field?.fom ?? '',
                                date ? dayjs(date).format('YYYY-MM-DD') : field?.tom ?? null,
                                field.beløp,
                                index
                            );
                        }}
                    >
                        <DatePicker.Input
                            label=""
                            className={styles.DateInput}
                            size="small"
                            defaultValue={field?.tom ? dayjs(field.tom).format(NORSK_DATOFORMAT) : ''}
                            placeholder="dd.mm.åååå"
                            onBlur={(e) => {
                                updateRefusjonsopplysninger(
                                    field.fom,
                                    e.target.value !== ''
                                        ? dayjs(e.target.value, NORSK_DATOFORMAT).format('YYYY-MM-DD')
                                        : '',
                                    field.beløp,
                                    index
                                );
                            }}
                        />
                    </DatePicker>
                    <input
                        {...register(`refusjonsopplysninger.${index}.beløp`)}
                        className={styles.BeløpInput}
                        type="number"
                        onBlur={(event) => {
                            updateRefusjonsopplysninger(
                                field.fom,
                                field?.tom ?? null,
                                Number(event.target.value),
                                index
                            );
                        }}
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
                            <CaseworkerFilled height={20} width={20} className={styles.Ikon} />
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
    const { control, register } = useFormContext<RefusjonFormValues>();

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
        register,
        addRefusjonsopplysning,
        removeRefusjonsopplysning,
        replaceRefusjonsopplysninger,
        updateRefusjonsopplysninger,
    };
}
