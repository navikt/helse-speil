import React, { ReactElement } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { PlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, DatePicker, ErrorMessage, HStack, Label, useDatepicker } from '@navikt/ds-react';

import { InntektOgRefusjonSchema, RefusjonsperiodeSchema } from '@/form-schemas/inntektOgRefusjonSkjema';
import { Kildetype } from '@io/graphql';
import { RefusjonFeiloppsummering } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjemaOld/refusjon/RefusjonFeiloppsumering';
import { RefusjonKilde } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjemaOld/refusjon/RefusjonKilde';
import { RefusjonsBeløpInput } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjemaOld/refusjon/RefusjonsBeløpInput';
import { somDate, somIsoDato } from '@utils/date';

import styles from './RefusjonSkjema.module.scss';

interface RefusjonProps {
    fraRefusjonsopplysninger: RefusjonsperiodeSchema[];
    lokaleRefusjonsopplysninger: RefusjonsperiodeSchema[];
    inntektFom: string | null;
    inntektTom: string | null;
}

export const RefusjonSkjemaOld = ({
    fraRefusjonsopplysninger,
    lokaleRefusjonsopplysninger,
    inntektFom,
    inntektTom,
}: RefusjonProps) => {
    const form = useFormContext<InntektOgRefusjonSchema>();
    const { fields, remove, append } = useFieldArray({
        name: 'refusjonsperioder',
        control: form.control,
    });

    return (
        <div id="refusjonsopplysninger">
            <Label size="small">Refusjon</Label>

            <HStack gap="6">
                <BodyShort>Fra og med dato</BodyShort>
                <BodyShort>Til og med dato</BodyShort>
                <BodyShort>Månedlig refusjon</BodyShort>
            </HStack>
            <div>
                {fields.map((refusjonsopplysning, index) => (
                    <React.Fragment key={refusjonsopplysning.id}>
                        <HStack
                            className={styles.RefusjonsRad}
                            data-testid="refusjonsopplysningrad"
                            gap="2"
                            align="center"
                            paddingBlock="2"
                        >
                            <DateField
                                name={`refusjonsperioder.${index}.fom`}
                                label="Fra og med dato"
                                defaultMonth={somDate(inntektFom ?? undefined)}
                            />
                            <DateField
                                name={`refusjonsperioder.${index}.tom`}
                                label="Til og med dato"
                                defaultMonth={somDate(inntektTom ?? undefined)}
                            />
                            <RefusjonsBeløpInput form={form} index={index} refusjonsopplysning={refusjonsopplysning} />
                            <RefusjonKilde
                                kilde={refusjonsopplysning.kilde as Kildetype}
                                harLokaleOpplysninger={lokaleRefusjonsopplysninger.length > 0}
                                harEndringer={
                                    JSON.stringify(lokaleRefusjonsopplysninger?.[index]) !==
                                    JSON.stringify(fraRefusjonsopplysninger?.[index])
                                }
                            />
                            <Button type="button" onClick={() => remove(index)} variant="tertiary" size="xsmall">
                                Slett
                            </Button>
                        </HStack>
                        <RefusjonFeiloppsummering error={form.formState.errors.refusjonsperioder?.[`${index}`]} />
                    </React.Fragment>
                ))}
            </div>
            {form.formState.errors.refusjonsperioder?.message && (
                <ErrorMessage size="small" showIcon>
                    {form.formState.errors.refusjonsperioder?.message}
                </ErrorMessage>
            )}

            <Button
                type="button"
                onClick={() => {
                    append({
                        fom: '',
                        tom: '',
                        beløp: 0,
                        kilde: Kildetype.Saksbehandler,
                    });
                }}
                icon={<PlusIcon />}
                variant="tertiary"
                size="xsmall"
            >
                Legg til
            </Button>
        </div>
    );
};

interface DateFieldProps {
    name: string;
    label: string;
    defaultMonth?: Date;
}

const DateField = ({ name, label, defaultMonth }: DateFieldProps): ReactElement => {
    const { field, fieldState } = useController({ name });

    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: field.value,
        defaultMonth: defaultMonth ?? field.value,
        onDateChange: (date) => {
            if (!date) {
                field.onChange(null);
            } else {
                field.onChange(somIsoDato(date));
            }
        },
    });

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input
                {...inputProps}
                id={name.replaceAll('.', '-')}
                size="small"
                label={label}
                onBlur={field.onBlur}
                error={fieldState.error?.message != undefined}
                hideLabel
            />
        </DatePicker>
    );
};
