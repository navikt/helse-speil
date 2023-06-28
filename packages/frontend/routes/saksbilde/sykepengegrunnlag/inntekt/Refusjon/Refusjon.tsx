import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { Controller, FieldError, useFieldArray, useFormContext } from 'react-hook-form';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort, UNSAFE_DatePicker as DatePicker, Fieldset } from '@navikt/ds-react';

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

interface DatoInputProps {
    updateDato: (dato: Maybe<string>) => void;
    clearError: () => void;
    dato?: Maybe<string>;
    error?: FieldError;
}

const DatoInput = ({ updateDato, clearError, dato, error }: DatoInputProps) => (
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

interface BeløpInputProps {
    beløp: number;
    updateBeløp: (beløp: number) => void;
    clearError: () => void;
    error?: FieldError;
}

const BeløpInput = ({ beløp, updateBeløp, clearError, error }: BeløpInputProps) => (
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

interface KildeInputProps {
    kilde: string;
    lokalRefusjonsopplysning?: Refusjonsopplysning;
    fraRefusjonsopplysning?: Refusjonsopplysning;
}

const KildeInput = ({ kilde, lokalRefusjonsopplysning, fraRefusjonsopplysning }: KildeInputProps) => (
    <Flex alignItems="center">
        {kilde === Kildetype.Inntektsmelding && (
            <Kilde type={kilde} className={styles.Ikon}>
                IM
            </Kilde>
        )}
        {kilde === Kildetype.Saksbehandler &&
            (lokalRefusjonsopplysning && !erLikRefusjonsopplysning(lokalRefusjonsopplysning, fraRefusjonsopplysning) ? (
                <div style={{ position: 'relative', width: '20px' }}>
                    <Endringstrekant />
                </div>
            ) : (
                <Kilde type={kilde} className={styles.Ikon}>
                    <CaseworkerFilled title="Caseworker-ikon" height={12} width={12} />
                </Kilde>
            ))}
    </Flex>
);

const erLikRefusjonsopplysning = (a?: Refusjonsopplysning, b?: Refusjonsopplysning) =>
    JSON.stringify(a) === JSON.stringify(b);

interface LeggTilRefusjonsopplysningKnappProps {
    onClick: () => void;
}

const LeggTilRefusjonsopplysningKnapp = ({ onClick }: LeggTilRefusjonsopplysningKnappProps) => (
    <Button type="button" onClick={onClick} className={styles.Button} style={{ marginTop: 0 }}>
        <BodyShort>+ Legg til</BodyShort>
    </Button>
);

interface SlettRefusjonsopplysningKnappProps {
    onClick: () => void;
}

const SlettRefusjonsopplysningKnapp = ({ onClick }: SlettRefusjonsopplysningKnappProps) => (
    <Button type="button" onClick={onClick} className={styles.Button} style={{ justifySelf: 'flex-end' }}>
        <BodyShort>Slett</BodyShort>
    </Button>
);

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
                        new Date(b.fom).getTime() - new Date(a.fom).getTime(),
                )
                .map((refusjonsopplysning) => {
                    return {
                        ...refusjonsopplysning,
                        beløp: Math.round((refusjonsopplysning.beløp + Number.EPSILON) * 100) / 100,
                    };
                }),
        );
    };

    const updateRefusjonsopplysninger = (
        fom: string,
        tom: Maybe<string>,
        beløp: number,
        index: number,
        kilde = Kildetype.Saksbehandler,
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
