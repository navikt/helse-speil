import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Button } from '@components/Button';
import { Kildetype } from '@io/graphql';
import { RefusjonFeiloppsummering } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/refusjon/RefusjonFeiloppsumering';
import { RefusjonKilde } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/refusjon/RefusjonKilde';
import { RefusjonsBeløpInput } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/refusjon/RefusjonsBeløpInput';
import { RefusjonsperiodeInput } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/refusjon/RefusjonsperiodeInput';
import { Refusjonsopplysning } from '@typer/overstyring';

import { RefusjonFormValues, useRefusjonFormField } from '../hooks/useRefusjonFormField';

import styles from './RefusjonSkjema.module.scss';

interface RefusjonProps {
    fraRefusjonsopplysninger: Refusjonsopplysning[];
    lokaleRefusjonsopplysninger: Refusjonsopplysning[];
}

export const RefusjonSkjema = ({ fraRefusjonsopplysninger, lokaleRefusjonsopplysninger }: RefusjonProps) => {
    const { fields, addRefusjonsopplysning, removeRefusjonsopplysning, replaceRefusjonsopplysninger } =
        useRefusjonFormField();
    const { formState } = useFormContext<RefusjonFormValues>();

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
                        <RefusjonsperiodeInput index={index} refusjonsopplysning={refusjonsopplysning} />
                        <RefusjonsBeløpInput index={index} refusjonsopplysning={refusjonsopplysning} />

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