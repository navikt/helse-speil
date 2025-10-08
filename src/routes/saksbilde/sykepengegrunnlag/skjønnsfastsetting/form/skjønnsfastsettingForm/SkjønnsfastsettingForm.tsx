import React, { ReactElement, useEffect, useRef } from 'react';
import { CustomElement, FieldErrors, FieldValues, FormProvider, useForm, useWatch } from 'react-hook-form';

import { Button, ErrorMessage, HStack, HelpText } from '@navikt/ds-react';

import { Feiloppsummering, Skjemafeil } from '@components/Feiloppsummering';
import { TimeoutModal } from '@components/TimeoutModal';
import { SkjønnsfastsettingMal } from '@external/sanity';
import {
    Arbeidsgiverinntekt,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    Maybe,
    PersonFragment,
    Skjonnsfastsettingstype,
    Sykepengegrunnlagsgrense,
    Sykepengegrunnlagskjonnsfastsetting,
} from '@io/graphql';
import { SkjønnsfastsettingBegrunnelse } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/SkjønnsfastsettingBegrunnelse';
import { SkjønnsfastsettingType } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/SkjønnsfastsettingType';
import { SkjønnsfastsettingÅrsak } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/SkjønnsfastsettingÅrsak';
import { SkjønnsfastsettingArbeidsgivere } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/arbeidsgivere/SkjønnsfastsettingArbeidsgivere';
import {
    Skjønnsfastsettingstype,
    usePostSkjønnsfastsattSykepengegrunnlag,
} from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting';
import { finnAlleInntektsforhold } from '@state/selectors/arbeidsgiver';
import { avrundetToDesimaler } from '@utils/tall';
import { isArbeidsgiver, isBeregnetPeriode } from '@utils/typeguards';

import { skjønnsfastsettingFormToDto } from './skjønnsfastsettingFormToDto';

import styles from './SkjønnsfastsettingForm.module.css';

export const useAktiveArbeidsgivere = (
    person: PersonFragment,
    period: BeregnetPeriodeFragment | GhostPeriodeFragment,
    inntekter: Arbeidsgiverinntekt[],
) =>
    finnAlleInntektsforhold(person)
        .filter(
            (inntektsforhold) =>
                inntektsforhold.generasjoner?.[0]?.perioder.some(
                    (it) => it.skjaeringstidspunkt === period.skjaeringstidspunkt,
                ) ||
                (isArbeidsgiver(inntektsforhold) &&
                    inntektsforhold.ghostPerioder.some(
                        (it) => it.skjaeringstidspunkt === period.skjaeringstidspunkt && !it.deaktivert,
                    )),
        )
        .filter(
            (inntektsforhold) =>
                inntekter.find(
                    (inntekt) =>
                        isArbeidsgiver(inntektsforhold) && inntekt.arbeidsgiver === inntektsforhold.organisasjonsnummer,
                )?.omregnetArsinntekt !== null,
        );

function useFormDefaults(
    skjønnsfastsettelseFormState: Maybe<SkjønnsfastsettingFormFields>,
    aktiveArbeidsgivereInntekter: Arbeidsgiverinntekt[],
    forrigeSkjønnsfastsettelse: Sykepengegrunnlagskjonnsfastsetting | null,
    avrundetSammenligningsgrunnlag: number,
): SkjønnsfastsettingFormFields {
    if (skjønnsfastsettelseFormState) {
        return skjønnsfastsettelseFormState;
    } else {
        if (forrigeSkjønnsfastsettelse && !forrigeSkjønnsfastsettelse.ferdigstilt) {
            const type = mapType(forrigeSkjønnsfastsettelse.skjonnsfastsatt.type);
            return {
                begrunnelseFritekst: forrigeSkjønnsfastsettelse.skjonnsfastsatt.begrunnelseFritekst ?? '',
                type: type,
                årsak: forrigeSkjønnsfastsettelse.skjonnsfastsatt.arsak,
                arbeidsgivere: initielleInntektsutfyllinger(
                    aktiveArbeidsgivereInntekter,
                    avrundetSammenligningsgrunnlag,
                    type,
                ),
            };
        } else {
            return {
                begrunnelseFritekst: '',
                type: null,
                årsak: '',
                arbeidsgivere: aktiveArbeidsgivereInntekter.map((inntekt) => ({
                    organisasjonsnummer: inntekt.arbeidsgiver,
                    årlig: 0,
                })),
            };
        }
    }
}

const mapType = (type: Maybe<Skjonnsfastsettingstype> = Skjonnsfastsettingstype.Annet): Skjønnsfastsettingstype => {
    switch (type) {
        case Skjonnsfastsettingstype.OmregnetArsinntekt:
            return Skjønnsfastsettingstype.OMREGNET_ÅRSINNTEKT;
        case Skjonnsfastsettingstype.RapportertArsinntekt:
            return Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT;
        case Skjonnsfastsettingstype.Annet:
        default:
            return Skjønnsfastsettingstype.ANNET;
    }
};

export interface SkjønnsfastsettingFormFields {
    arbeidsgivere: SkjønnsfastsettingFormFieldsArbeidsgiver[];
    årsak: string;
    type: Skjønnsfastsettingstype | null;
    begrunnelseFritekst: string;
}

export interface SkjønnsfastsettingFormFieldsArbeidsgiver {
    organisasjonsnummer: string;
    årlig: number;
}

interface SkjønnsfastsettingFormProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment | GhostPeriodeFragment;
    inntekter: Arbeidsgiverinntekt[];
    omregnetÅrsinntekt: number;
    sammenligningsgrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    onEndretSykepengegrunnlag: (endretSykepengegrunnlag: Maybe<number>) => void;
    closeAndResetForm: () => void;
    maler: SkjønnsfastsettingMal[];
    sisteSkjønnsfastsettelse: Sykepengegrunnlagskjonnsfastsetting | null;
    formValues: Maybe<SkjønnsfastsettingFormFields>;
    setFormValues: (skjønnsfastsettingFormFields: SkjønnsfastsettingFormFields) => void;
}

const initielleInntektsutfyllinger = (
    aktiveArbeidsgivereInntekter: Arbeidsgiverinntekt[],
    avrundetSammenligningsgrunnlag: number,
    valgtType: Skjønnsfastsettingstype | null,
) =>
    aktiveArbeidsgivereInntekter?.map((inntekt) => ({
        organisasjonsnummer: inntekt.arbeidsgiver,
        årlig: initiellInntektsutfylling(
            inntekt,
            aktiveArbeidsgivereInntekter.length,
            avrundetSammenligningsgrunnlag,
            valgtType,
        ),
    })) ?? [];

const initiellInntektsutfylling = (
    inntekt: Arbeidsgiverinntekt,
    antallAktiveArbeidsgivere: number,
    totaltSammenligningsgrunnlag: number,
    type: Skjønnsfastsettingstype | null,
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

export const SkjønnsfastsettingForm = ({
    person,
    periode,
    inntekter,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    sykepengegrunnlagsgrense,
    onEndretSykepengegrunnlag,
    closeAndResetForm,
    maler,
    sisteSkjønnsfastsettelse,
    formValues,
    setFormValues,
}: SkjønnsfastsettingFormProps): ReactElement | null => {
    const inntektsforhold = useAktiveArbeidsgivere(person, periode, inntekter);
    const aktiveArbeidsgivereInntekter = inntekter.filter((inntekt) =>
        inntektsforhold.some(
            (inntektsforhold) =>
                isArbeidsgiver(inntektsforhold) &&
                inntektsforhold.organisasjonsnummer === inntekt.arbeidsgiver &&
                inntekt.omregnetArsinntekt !== null &&
                !inntekt.deaktivert,
        ),
    );
    const erBeslutteroppgave = isBeregnetPeriode(periode) && (periode.totrinnsvurdering?.erBeslutteroppgave ?? false);
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const avrundetSammenligningsgrunnlag = avrundetToDesimaler(sammenligningsgrunnlag);
    const { isLoading, error, postSkjønnsfastsetting, timedOut, setTimedOut } =
        usePostSkjønnsfastsattSykepengegrunnlag(closeAndResetForm);

    const form = useForm<SkjønnsfastsettingFormFields>({
        shouldFocusError: false,
        mode: 'onBlur',
        defaultValues: useFormDefaults(
            formValues,
            aktiveArbeidsgivereInntekter,
            sisteSkjønnsfastsettelse,
            avrundetSammenligningsgrunnlag,
        ),
    });

    const { control, formState, setValue, getValues, handleSubmit, watch } = form;

    const valgtType = useWatch({
        name: 'type',
        control: control,
    });
    const prevValgtType = useRef(valgtType);

    const valgtÅrsak = useWatch({
        name: 'årsak',
        control: control,
    });

    const watchedFormFields = watch();
    const prevFormFields = useRef(watchedFormFields);

    useEffect(() => {
        if (JSON.stringify(prevFormFields.current) !== JSON.stringify(watchedFormFields)) {
            setFormValues(watchedFormFields);
            prevFormFields.current = watchedFormFields;
        }
    }, [watchedFormFields, setFormValues]);

    const valgtMal = maler.find((it) => it.arsak === valgtÅrsak);

    const harFeil = !formState.isValid && formState.isSubmitted;

    const visFeilOppsummering = harFeil && Object.entries(formState.errors).length > 0;
    const sykepengegrunnlagEndring = watch('arbeidsgivere')?.reduce(
        (a: number, b: SkjønnsfastsettingFormFieldsArbeidsgiver) => +a + +b.årlig,
        0.0,
    );

    useEffect(() => {
        if (harFeil) feiloppsummeringRef.current?.focus();
    }, [harFeil]);

    useEffect(() => {
        onEndretSykepengegrunnlag(sykepengegrunnlagEndring);
    }, [onEndretSykepengegrunnlag, sykepengegrunnlagEndring]);

    useEffect(() => {
        if (prevValgtType.current !== valgtType) {
            setValue(
                'arbeidsgivere',
                initielleInntektsutfyllinger(aktiveArbeidsgivereInntekter, avrundetSammenligningsgrunnlag, valgtType),
            );
            prevValgtType.current = valgtType;
        }
    }, [valgtType, avrundetSammenligningsgrunnlag, setValue, aktiveArbeidsgivereInntekter]);

    if (!inntektsforhold || !aktiveArbeidsgivereInntekter) return null;

    const confirmChanges = () => {
        postSkjønnsfastsetting(
            skjønnsfastsettingFormToDto(
                getValues(),
                inntekter,
                person,
                periode,
                omregnetÅrsinntekt,
                sammenligningsgrunnlag,
                maler.find((it) => it.arsak === valgtÅrsak),
            ),
        );
    };

    const harValgt25Avvik = valgtMal?.lovhjemmel.ledd === '2';

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(confirmChanges)} autoComplete="off">
                <div className={styles.skjønnsfastsetting}>
                    <SkjønnsfastsettingÅrsak maler={maler} />
                    {harValgt25Avvik && <SkjønnsfastsettingType />}
                    {((harValgt25Avvik && valgtType) || (valgtÅrsak !== '' && !harValgt25Avvik)) && (
                        <>
                            <SkjønnsfastsettingArbeidsgivere
                                arbeidsgivere={inntektsforhold}
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
                                    feilliste={formErrorsTilFeilliste(formState.errors)}
                                />
                            )}
                            <HStack gap="2" align="center" marginBlock="4 0">
                                {!erBeslutteroppgave ? (
                                    <Button size="small" variant="secondary" type="submit" loading={isLoading}>
                                        Lagre
                                    </Button>
                                ) : (
                                    <HelpText>Kan ikke overstyre en beslutteroppgave</HelpText>
                                )}
                                <Button size="small" variant="tertiary" type="button" onClick={closeAndResetForm}>
                                    Avbryt
                                </Button>
                            </HStack>
                        </>
                    )}
                    {error && <ErrorMessage className={styles.error}>{error}</ErrorMessage>}
                    {timedOut && <TimeoutModal showModal={timedOut} closeModal={() => setTimedOut(false)} />}
                </div>
            </form>
        </FormProvider>
    );
};

interface RefMedId extends CustomElement<FieldValues> {
    id?: string;
}

const formErrorsTilFeilliste = (errors: FieldErrors<SkjønnsfastsettingFormFields>): Skjemafeil[] =>
    Object.entries(errors).map(([id, error]) => ({
        id: (error?.ref as RefMedId)?.id ?? id,
        melding: ((error as Array<unknown>)?.length !== undefined ? error?.root?.message : error.message) ?? id,
    }));
