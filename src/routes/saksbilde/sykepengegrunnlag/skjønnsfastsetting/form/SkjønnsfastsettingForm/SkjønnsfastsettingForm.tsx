import React, { useEffect, useRef } from 'react';
import { CustomElement, FieldErrors, FieldValues, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { Button, Loader } from '@navikt/ds-react';

import { SkjønnsfastsettingMal } from '@/external/sanity';
import { ErrorMessage } from '@components/ErrorMessage';
import { TimeoutModal } from '@components/TimeoutModal';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Arbeidsgiverinntekt, Sykepengegrunnlagsgrense } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';

import { Feiloppsummering, Skjemafeil } from '../../../inntekt/EditableInntekt/Feiloppsummering';
import {
    ArbeidsgiverForm,
    Skjønnsfastsettingstype,
    usePostSkjønnsfastsattSykepengegrunnlag,
} from '../../skjønnsfastsetting';
import { SkjønnsfastsettingBegrunnelse } from '../SkjønnsfastsettingBegrunnelse';
import { SkjønnsfastsettingType } from '../SkjønnsfastsettingType';
import { SkjønnsfastsettingÅrsak } from '../SkjønnsfastsettingÅrsak';
import { SkjønnsfastsettingArbeidsgivere } from '../arbeidsgivere/SkjønnsfastsettingArbeidsgivere';
import { skjønnsfastsettingFormToDto } from './skjønnsfastsettingFormToDto';
import { useSkjønnsfastsettingDefaults } from './useSkjønnsfastsettingDefaults';

import styles from './SkjønnsfastsettingForm.module.css';

export interface SkjønnsfastsettingFormFields {
    arbeidsgivere: ArbeidsgiverForm[];
    årsak: string;
    type?: Skjønnsfastsettingstype;
    begrunnelseFritekst: string;
}

interface SkjønnsfastsettingFormProps {
    inntekter: Arbeidsgiverinntekt[];
    omregnetÅrsinntekt: number;
    sammenligningsgrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    onEndretSykepengegrunnlag: (endretSykepengegrunnlag: Maybe<number>) => void;
    setEditing: (state: boolean) => void;
    maler: SkjønnsfastsettingMal[];
}

export const SkjønnsfastsettingForm = ({
    inntekter,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    sykepengegrunnlagsgrense,
    onEndretSykepengegrunnlag,
    setEditing,
    maler,
}: SkjønnsfastsettingFormProps) => {
    const period = useActivePeriod();
    const person = useCurrentPerson();
    const { aktiveArbeidsgivere, aktiveArbeidsgivereInntekter, defaults } = useSkjønnsfastsettingDefaults(inntekter);
    const erReadonly = useIsReadOnlyOppgave();
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const avrundetSammenligningsgrunnlag = Math.round((sammenligningsgrunnlag + Number.EPSILON) * 100) / 100;
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

    const valgtType = useWatch({
        name: 'type',
        control: form.control,
    });

    const valgtÅrsak = useWatch({
        name: 'årsak',
        control: form.control,
    });

    const valgtMal = maler.find((it) => it.arsak === valgtÅrsak);

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
                    avrundetSammenligningsgrunnlag,
                    valgtType,
                ),
            })) ?? [],
        );
    }, [valgtType]);

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
                maler.find((it) => it.arsak === valgtÅrsak),
            ),
        );
    };

    const harValgt25Avvik = valgtMal?.lovhjemmel.ledd === '2';

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <div className={styles.skjønnsfastsetting}>
                    <SkjønnsfastsettingÅrsak maler={maler} />
                    {harValgt25Avvik && <SkjønnsfastsettingType />}
                    {((harValgt25Avvik && valgtType) || (valgtÅrsak !== '' && !harValgt25Avvik)) && (
                        <>
                            <SkjønnsfastsettingArbeidsgivere
                                arbeidsgivere={aktiveArbeidsgivere}
                                sammenligningsgrunnlag={avrundetSammenligningsgrunnlag}
                                sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                            />
                            <SkjønnsfastsettingBegrunnelse
                                omregnetÅrsinntekt={omregnetÅrsinntekt}
                                sammenligningsgrunnlag={avrundetSammenligningsgrunnlag}
                                valgtMal={valgtMal}
                            />
                            {visFeilOppsummering && (
                                <Feiloppsummering
                                    feiloppsummeringRef={feiloppsummeringRef}
                                    feilliste={formErrorsTilFeilliste(form.formState.errors)}
                                />
                            )}
                            <div className={styles.buttons}>
                                <Button
                                    className={styles.button}
                                    variant="secondary"
                                    size="small"
                                    disabled={isLoading || erReadonly}
                                >
                                    Lagre
                                    {isLoading && <Loader size="xsmall" />}
                                </Button>
                                <Button
                                    className={styles.button}
                                    variant="tertiary"
                                    onClick={cancelEditing}
                                    size="small"
                                >
                                    Avbryt
                                </Button>
                            </div>
                        </>
                    )}
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
    type?: Skjønnsfastsettingstype,
): number => {
    switch (type) {
        case Skjønnsfastsettingstype.OMREGNET_ÅRSINNTEKT:
            return Math.round(((inntekt.omregnetArsinntekt?.belop ?? 0) + Number.EPSILON) * 100) / 100;
        case Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT:
            return antallAktiveArbeidsgivere > 1
                ? 0
                : Math.round((totaltSammenligningsgrunnlag + Number.EPSILON) * 100) / 100;
        case Skjønnsfastsettingstype.ANNET:
        default:
            return 0;
    }
};

const formErrorsTilFeilliste = (errors: FieldErrors<SkjønnsfastsettingFormFields>): Skjemafeil[] =>
    Object.entries(errors).map(([id, error]) => ({
        id: (error?.ref as RefMedId)?.id ?? id,
        melding: ((error as Array<unknown>)?.length !== undefined ? error?.root?.message : error.message) ?? id,
    }));
