import { atom, useAtomValue, useSetAtom } from 'jotai/index';
import { atomFamily } from 'jotai/utils';
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
    ArbeidsgiverForm,
    Skjønnsfastsettingstype,
    usePostSkjønnsfastsattSykepengegrunnlag,
} from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting';
import { avrundetToDesimaler } from '@utils/tall';
import { isBeregnetPeriode } from '@utils/typeguards';

import { skjønnsfastsettingFormToDto } from './skjønnsfastsettingFormToDto';

import styles from './SkjønnsfastsettingForm.module.css';

const skjemaFamily = atomFamily((_skjæringstidspunkt: string) => atom<Maybe<SkjønnsfastsettingFormFields>>(null));

export const useSkjønnsfastsettelseFormState = (skjæringstidspunkt: string) =>
    useAtomValue(skjemaFamily(skjæringstidspunkt));

export const useSetSkjønnsfastsettelseFormState = (skjæringstidspunkt: string) => {
    const setState = useSetAtom(skjemaFamily(skjæringstidspunkt));
    return (årsak: string, begrunnelseFritekst: string, type?: Skjønnsfastsettingstype) => {
        setState((prevState) => {
            return {
                ...(prevState ?? defaultState),
                type: type,
                årsak: årsak,
                begrunnelseFritekst: begrunnelseFritekst,
            } as SkjønnsfastsettingFormFields;
        });
    };
};

const defaultState: SkjønnsfastsettingFormFields = {
    begrunnelseFritekst: '',
    type: undefined,
    årsak: '',
    arbeidsgivere: [],
};

export const useAktiveArbeidsgivere = (
    person: PersonFragment,
    period: BeregnetPeriodeFragment | GhostPeriodeFragment,
    inntekter: Arbeidsgiverinntekt[],
) =>
    person.arbeidsgivere
        .filter(
            (arbeidsgiver) =>
                arbeidsgiver.generasjoner?.[0]?.perioder.some(
                    (it) => it.skjaeringstidspunkt === period.skjaeringstidspunkt,
                ) ||
                arbeidsgiver.ghostPerioder.some(
                    (it) => it.skjaeringstidspunkt === period.skjaeringstidspunkt && !it.deaktivert,
                ),
        )
        .filter(
            (arbeidsgiver) =>
                inntekter.find((inntekt) => inntekt.arbeidsgiver === arbeidsgiver.organisasjonsnummer)
                    ?.omregnetArsinntekt !== null,
        );

function useFormDefaults(
    period: BeregnetPeriodeFragment | GhostPeriodeFragment,
    aktiveArbeidsgivereInntekter: Arbeidsgiverinntekt[],
    forrigeSkjønnsfastsettelse: Sykepengegrunnlagskjonnsfastsetting | null,
): SkjønnsfastsettingFormFields {
    const skjønnsfastsettelseFormState = useSkjønnsfastsettelseFormState(period.skjaeringstidspunkt);
    if (skjønnsfastsettelseFormState) {
        return {
            begrunnelseFritekst: skjønnsfastsettelseFormState.begrunnelseFritekst,
            type: skjønnsfastsettelseFormState.type,
            årsak: skjønnsfastsettelseFormState.årsak,
            arbeidsgivere: aktiveArbeidsgivereInntekter.map((inntekt) => ({
                organisasjonsnummer: inntekt.arbeidsgiver,
                årlig: 0,
            })),
        };
    } else {
        if (forrigeSkjønnsfastsettelse && !forrigeSkjønnsfastsettelse.ferdigstilt) {
            return {
                begrunnelseFritekst: forrigeSkjønnsfastsettelse.skjonnsfastsatt.begrunnelseFritekst ?? '',
                type: mapType(forrigeSkjønnsfastsettelse.skjonnsfastsatt.type) ?? '',
                årsak: forrigeSkjønnsfastsettelse.skjonnsfastsatt.arsak ?? '',
                arbeidsgivere: aktiveArbeidsgivereInntekter.map((inntekt) => ({
                    organisasjonsnummer: inntekt.arbeidsgiver,
                    årlig: 0,
                })),
            };
        } else {
            return {
                begrunnelseFritekst: '',
                type: undefined,
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
    arbeidsgivere: ArbeidsgiverForm[];
    årsak: string;
    type?: Skjønnsfastsettingstype;
    begrunnelseFritekst: string;
}

interface SkjønnsfastsettingFormProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment | GhostPeriodeFragment;
    inntekter: Arbeidsgiverinntekt[];
    omregnetÅrsinntekt: number;
    sammenligningsgrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    onEndretSykepengegrunnlag: (endretSykepengegrunnlag: Maybe<number>) => void;
    setEditing: (state: boolean) => void;
    maler: SkjønnsfastsettingMal[];
    sisteSkjønnsfastsettelse: Sykepengegrunnlagskjonnsfastsetting | null;
}

export const SkjønnsfastsettingForm = ({
    person,
    periode,
    inntekter,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    sykepengegrunnlagsgrense,
    onEndretSykepengegrunnlag,
    setEditing,
    maler,
    sisteSkjønnsfastsettelse,
}: SkjønnsfastsettingFormProps): Maybe<ReactElement> => {
    const aktiveArbeidsgivere = useAktiveArbeidsgivere(person, periode, inntekter);
    const aktiveArbeidsgivereInntekter = inntekter.filter((inntekt) =>
        aktiveArbeidsgivere.some(
            (arbeidsgiver) =>
                arbeidsgiver.organisasjonsnummer === inntekt.arbeidsgiver && inntekt.omregnetArsinntekt !== null,
        ),
    );
    const erBeslutteroppgave = isBeregnetPeriode(periode) && (periode.totrinnsvurdering?.erBeslutteroppgave ?? false);
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const setSkjønnsfastsettelseFormState = useSetSkjønnsfastsettelseFormState(periode.skjaeringstidspunkt);
    const avrundetSammenligningsgrunnlag = avrundetToDesimaler(sammenligningsgrunnlag);
    const cancelEditing = () => {
        setEditing(false);
    };
    const { isLoading, error, postSkjønnsfastsetting, timedOut, setTimedOut } =
        usePostSkjønnsfastsattSykepengegrunnlag(cancelEditing);

    const form = useForm<SkjønnsfastsettingFormFields>({
        shouldFocusError: false,
        mode: 'onBlur',
        defaultValues: useFormDefaults(periode, aktiveArbeidsgivereInntekter, sisteSkjønnsfastsettelse),
    });

    const { control, formState, setValue, getValues, handleSubmit, watch } = form;

    const valgtType = useWatch({
        name: 'type',
        control: control,
    });

    const valgtÅrsak = useWatch({
        name: 'årsak',
        control: control,
    });

    const watchedValues = watch(['årsak', 'begrunnelseFritekst', 'type']);

    const prevValues = useRef(watchedValues);

    useEffect(() => {
        if (JSON.stringify(prevValues.current) !== JSON.stringify(watchedValues)) {
            setSkjønnsfastsettelseFormState(watchedValues[0], watchedValues[1], watchedValues[2]);
            prevValues.current = watchedValues;
        }
    }, [watchedValues, setSkjønnsfastsettelseFormState]);

    const valgtMal = maler.find((it) => it.arsak === valgtÅrsak);

    const harFeil = !formState.isValid && formState.isSubmitted;

    const visFeilOppsummering = harFeil && Object.entries(formState.errors).length > 0;
    const sykepengegrunnlagEndring = watch('arbeidsgivere')?.reduce(
        (a: number, b: ArbeidsgiverForm) => +a + +b.årlig,
        0.0,
    );

    useEffect(() => {
        if (harFeil) feiloppsummeringRef.current?.focus();
    }, [harFeil]);

    useEffect(() => {
        onEndretSykepengegrunnlag(sykepengegrunnlagEndring);
    }, [onEndretSykepengegrunnlag, sykepengegrunnlagEndring]);

    useEffect(() => {
        setValue(
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
        /* eslint-disable-next-line react-hooks/exhaustive-deps --
         * Siden vi har designet formset som vi har må vi hacke valuen her.
         * Ideelt burde dette redesignes for å kunne sette value når formet
         * blir satt opp.
         **/
    }, [valgtType, avrundetSammenligningsgrunnlag, setValue]);

    if (!aktiveArbeidsgivere || !aktiveArbeidsgivereInntekter) return null;

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
                                <Button size="small" variant="tertiary" type="button" onClick={cancelEditing}>
                                    Avbryt
                                </Button>
                            </HStack>
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
