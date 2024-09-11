import React, { ReactElement, useEffect, useRef } from 'react';
import { CustomElement, FieldErrors, FieldValues, FormProvider, useForm, useWatch } from 'react-hook-form';

import { Button } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { Feiloppsummering, Skjemafeil } from '@components/Feiloppsummering';
import { TimeoutModal } from '@components/TimeoutModal';
import { SkjønnsfastsettingMal } from '@external/sanity';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Arbeidsgiverinntekt, Maybe, PersonFragment, Sykepengegrunnlagsgrense } from '@io/graphql';
import { SkjønnsfastsettingBegrunnelse } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/SkjønnsfastsettingBegrunnelse';
import { SkjønnsfastsettingType } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/SkjønnsfastsettingType';
import { SkjønnsfastsettingÅrsak } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/SkjønnsfastsettingÅrsak';
import { SkjønnsfastsettingArbeidsgivere } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/arbeidsgivere/SkjønnsfastsettingArbeidsgivere';
import {
    ArbeidsgiverForm,
    Skjønnsfastsettingstype,
    usePostSkjønnsfastsattSykepengegrunnlag,
} from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting';
import { useActivePeriod } from '@state/periode';
import { avrundetToDesimaler } from '@utils/tall';

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
    person: PersonFragment;
    inntekter: Arbeidsgiverinntekt[];
    omregnetÅrsinntekt: number;
    sammenligningsgrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    onEndretSykepengegrunnlag: (endretSykepengegrunnlag: Maybe<number>) => void;
    setEditing: (state: boolean) => void;
    maler: SkjønnsfastsettingMal[];
}

export const SkjønnsfastsettingForm = ({
    person,
    inntekter,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    sykepengegrunnlagsgrense,
    onEndretSykepengegrunnlag,
    setEditing,
    maler,
}: SkjønnsfastsettingFormProps): Maybe<ReactElement> => {
    const period = useActivePeriod();
    const { aktiveArbeidsgivere, aktiveArbeidsgivereInntekter, defaults } = useSkjønnsfastsettingDefaults(
        person,
        inntekter,
    );
    const erReadonly = useIsReadOnlyOppgave();
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const avrundetSammenligningsgrunnlag = avrundetToDesimaler(sammenligningsgrunnlag);
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
                                    size="small"
                                    variant="secondary"
                                    type="submit"
                                    disabled={erReadonly}
                                    loading={isLoading}
                                >
                                    Lagre
                                </Button>
                                <Button size="small" variant="tertiary" type="button" onClick={cancelEditing}>
                                    Avbryt
                                </Button>
                            </div>
                        </>
                    )}
                    {error && <ErrorMessage className={styles.error}>{error}</ErrorMessage>}
                    {timedOut && <TimeoutModal showModal={timedOut} onClose={() => setTimedOut(false)} />}
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
            return avrundetToDesimaler(inntekt.omregnetArsinntekt?.belop ?? 0);
        case Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT:
            return antallAktiveArbeidsgivere > 1 ? 0 : avrundetToDesimaler(totaltSammenligningsgrunnlag);
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
