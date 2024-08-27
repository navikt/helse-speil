import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Button } from '@components/Button';
import { Kildetype } from '@io/graphql';
import { FomPicker } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/FomPicker';
import { RefusjonFeiloppsummering } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/RefusjonFeiloppsumering';
import { RefusjonKilde } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/RefusjonKilde';
import { RefusjonsBeløpInput } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/RefusjonsBeløpInput';
import { TomPicker } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/TomPicker';
import { Refusjonsopplysning } from '@typer/overstyring';
import { ISO_DATOFORMAT } from '@utils/date';

import { RefusjonFormValues, useRefusjonFormField } from './useRefusjonFormField';

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

                    <RefusjonFeiloppsummering error={formState.errors.refusjonsopplysninger?.[`${index}`]} />
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
