import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { PlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Label } from '@navikt/ds-react';

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
                                variant="tertiary"
                                size="xsmall"
                            >
                                Slett
                            </Button>
                        </HStack>

                        <RefusjonFeiloppsummering error={formState.errors.refusjonsopplysninger?.[`${index}`]} />
                    </React.Fragment>
                ))}
            </div>
            <Button type="button" onClick={addRefusjonsopplysning} icon={<PlusIcon />} variant="tertiary" size="xsmall">
                Legg til
            </Button>
        </div>
    );
};
