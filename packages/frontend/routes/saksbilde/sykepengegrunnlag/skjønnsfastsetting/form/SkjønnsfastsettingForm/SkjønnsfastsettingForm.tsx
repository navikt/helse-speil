import { skjønnsfastsettingFormToDto } from './skjønnsfastsettingFormToDto';
import { useSkjønnsfastsettingDefaults } from './useSkjønnsfastsettingDefaults';
import React, { useEffect, useRef } from 'react';
import { FieldErrors, FormProvider, useForm, useWatch } from 'react-hook-form';
import { CustomElement, FieldValues } from 'react-hook-form/dist/types/fields';

import { Button, Loader } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { TimeoutModal } from '@components/TimeoutModal';
import { Arbeidsgiverinntekt } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';

import { Feiloppsummering, Skjemafeil } from '../../../inntekt/EditableInntekt/Feiloppsummering';
import { ArbeidsgiverForm, usePostSkjønnsfastsattSykepengegrunnlag } from '../../skjønnsfastsetting';
import { SkjønnsfastsettingBegrunnelse } from '../SkjønnsfastsettingBegrunnelse';
import { SkjønnsfastsettingType } from '../SkjønnsfastsettingType';
import { SkjønnsfastsettingÅrsak } from '../SkjønnsfastsettingÅrsak';
import { SkjønnsfastsettingArbeidsgivere } from '../arbeidsgivere/SkjønnsfastsettingArbeidsgivere';

import styles from './SkjønnsfastsettingForm.module.css';

export interface SkjønnsfastsettingFormFields {
    arbeidsgivere: ArbeidsgiverForm[];
    årsak: string;
    begrunnelseId: string;
    begrunnelseFritekst: string;
}

interface SkjønnsfastsettingFormProps {
    inntekter: Arbeidsgiverinntekt[];
    omregnetÅrsinntekt: number;
    sammenligningsgrunnlag: number;
    onEndretSykepengegrunnlag: (endretSykepengegrunnlag: Maybe<number>) => void;
    setEditing: (state: boolean) => void;
}

export const SkjønnsfastsettingForm = ({
    inntekter,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    onEndretSykepengegrunnlag,
    setEditing,
}: SkjønnsfastsettingFormProps) => {
    const period = useActivePeriod();
    const person = useCurrentPerson();
    const { aktiveArbeidsgivere, aktiveArbeidsgivereInntekter, defaults } = useSkjønnsfastsettingDefaults(inntekter);
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const cancelEditing = () => {
        setEditing(false);
    };
    const { isLoading, error, postSkjønnsfastsetting, timedOut, setTimedOut } =
        usePostSkjønnsfastsattSykepengegrunnlag(cancelEditing);

    const form = useForm<SkjønnsfastsettingFormFields>({
        shouldFocusError: false,
        mode: 'onBlur',
        values: defaults,
    });

    const valgtBegrunnelseId = useWatch({
        name: 'begrunnelseId',
        control: form.control,
    });

    const harFeil = !form.formState.isValid && form.formState.isSubmitted;
    const visFeilOppsummering = harFeil && Object.entries(form.formState.errors).length > 0;
    const sykepengegrunnlagEndring = form
        .watch('arbeidsgivere')
        ?.reduce((a: number, b: ArbeidsgiverForm) => +a + +b.årlig, 0.0);

    useEffect(() => {
        harFeil && feiloppsummeringRef.current?.focus();
    }, [harFeil]);

    useEffect(() => {
        onEndretSykepengegrunnlag(sykepengegrunnlagEndring);
    }, [sykepengegrunnlagEndring]);

    useEffect(() => {
        form.setValue(
            'arbeidsgivere',
            aktiveArbeidsgivereInntekter?.map((inntekt) => ({
                organisasjonsnummer: inntekt.arbeidsgiver,
                årlig: valgtInntekt(
                    inntekt,
                    aktiveArbeidsgivereInntekter.length,
                    sammenligningsgrunnlag,
                    valgtBegrunnelseId,
                ),
            })) ?? [],
        );
    }, [valgtBegrunnelseId]);

    if (!period || !person || !aktiveArbeidsgivere || !aktiveArbeidsgivereInntekter) return null;

    const confirmChanges = () => {
        postSkjønnsfastsetting(
            skjønnsfastsettingFormToDto(
                form.getValues(),
                inntekter,
                person,
                period,
                omregnetÅrsinntekt,
                sammenligningsgrunnlag,
            ),
        );
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <div className={styles.skjønnsfastsetting}>
                    <SkjønnsfastsettingÅrsak />
                    <SkjønnsfastsettingType />
                    <SkjønnsfastsettingArbeidsgivere
                        arbeidsgivere={aktiveArbeidsgivere}
                        sammenligningsgrunnlag={sammenligningsgrunnlag}
                        inntekter={inntekter}
                    />
                    <SkjønnsfastsettingBegrunnelse
                        omregnetÅrsinntekt={omregnetÅrsinntekt}
                        sammenligningsgrunnlag={sammenligningsgrunnlag}
                    />
                    {visFeilOppsummering && (
                        <Feiloppsummering
                            feiloppsummeringRef={feiloppsummeringRef}
                            feilliste={formErrorsTilFeilliste(form.formState.errors)}
                        />
                    )}
                    <div className={styles.buttons}>
                        <Button className={styles.button} variant="secondary" size="small" disabled={isLoading}>
                            Lagre
                            {isLoading && <Loader size="xsmall" />}
                        </Button>
                        <Button className={styles.button} variant="tertiary" onClick={cancelEditing} size="small">
                            Avbryt
                        </Button>
                    </div>
                    {error && <ErrorMessage className={styles.error}>{error}</ErrorMessage>}
                    {timedOut && <TimeoutModal onRequestClose={() => setTimedOut(false)} />}
                </div>
            </form>
        </FormProvider>
    );
};

interface RefMedId extends CustomElement<FieldValues> {
    id?: string;
}

const valgtInntekt = (
    inntekt: Arbeidsgiverinntekt,
    antallAktiveArbeidsgivere: number,
    totaltSammenligningsgrunnlag: number,
    begrunnelseId?: string,
): number => {
    switch (begrunnelseId) {
        case '0':
            return inntekt.omregnetArsinntekt?.belop ?? 0;
        case '1':
            return antallAktiveArbeidsgivere > 1
                ? inntekt.sammenligningsgrunnlag?.belop ?? 0
                : totaltSammenligningsgrunnlag;
        case '2':
        default:
            return 0;
    }
};

const formErrorsTilFeilliste = (errors: FieldErrors<SkjønnsfastsettingFormFields>): Skjemafeil[] =>
    Object.entries(errors).map(([id, error]) => ({
        id: (error?.ref as RefMedId)?.id ?? id,
        melding: ((error as Array<unknown>)?.length !== undefined ? error?.root?.message : error.message) ?? id,
    }));
