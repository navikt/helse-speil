import React, { useEffect, useRef } from 'react';
import { FieldErrors, FormProvider, useForm, useWatch } from 'react-hook-form';
import { CustomElement, FieldValues } from 'react-hook-form/dist/types/fields';
import { useRecoilState } from 'recoil';

import { Button, Loader } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { TimeoutModal } from '@components/TimeoutModal';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Arbeidsgiverinntekt, Sykepengegrunnlagsgrense } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { erProd, sanityMaler } from '@utils/featureToggles';

import { Feiloppsummering, Skjemafeil } from '../../../inntekt/EditableInntekt/Feiloppsummering';
import { ArbeidsgiverForm, usePostSkjønnsfastsattSykepengegrunnlag } from '../../skjønnsfastsetting';
import { SkjønnsfastsettingMal, skjønnsfastsettingMaler } from '../../state';
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
    begrunnelseId: string;
    begrunnelseFritekst: string;
}

interface SkjønnsfastsettingFormProps {
    inntekter: Arbeidsgiverinntekt[];
    omregnetÅrsinntekt: number;
    sammenligningsgrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    avviksprosent: number;
    onEndretSykepengegrunnlag: (endretSykepengegrunnlag: Maybe<number>) => void;
    setEditing: (state: boolean) => void;
}

export const SkjønnsfastsettingForm = ({
    inntekter,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    sykepengegrunnlagsgrense,
    avviksprosent,
    onEndretSykepengegrunnlag,
    setEditing,
}: SkjønnsfastsettingFormProps) => {
    const period = useActivePeriod();
    const person = useCurrentPerson();
    const { aktiveArbeidsgivere, aktiveArbeidsgivereInntekter, defaults } = useSkjønnsfastsettingDefaults(inntekter);
    const erReadonly = useIsReadOnlyOppgave();
    const [maler, setMaler] = useRecoilState(skjønnsfastsettingMaler);
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const avrundetSammenligningsgrunnlag = Math.round((sammenligningsgrunnlag + Number.EPSILON) * 100) / 100;
    const arbeidsforholdMal = (aktiveArbeidsgivere?.length ?? 0) > 1 ? 'FLERE_ARBEIDSGIVERE' : 'EN_ARBEIDSGIVER';
    const cancelEditing = () => {
        setEditing(false);
    };

    useEffect(() => {
        if (!sanityMaler) return;
        console.log(maler);
        const response = fetch('https://z9kr8ddn.api.sanity.io/v2023-08-01/data/query/production', {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ query: `*[_type == "skjonnsfastsettelseMal"]` }),
        });
        response
            .then((response) => response.json())
            .then((it) =>
                setMaler(
                    it.result
                        .filter((it: SkjønnsfastsettingMal) =>
                            avviksprosent <= 25 ? !it._id.includes('25Prosent') : true,
                        )
                        .filter((it: SkjønnsfastsettingMal) => it.arbeidsforholdMal.includes(arbeidsforholdMal))
                        .filter((it: SkjønnsfastsettingMal) => (erProd() ? it.iProd : true)),
                ),
            );
    }, []);

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

    const valgtÅrsak = useWatch({
        name: 'årsak',
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
                    avrundetSammenligningsgrunnlag,
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
                maler.find((it) => it.arsak === valgtÅrsak),
            ),
        );
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <div className={styles.skjønnsfastsetting}>
                    <SkjønnsfastsettingÅrsak />
                    {(!sanityMaler || (sanityMaler && valgtÅrsak.includes('25 %'))) && <SkjønnsfastsettingType />}
                    {(((!sanityMaler || (sanityMaler && valgtÅrsak.includes('25 %'))) && valgtBegrunnelseId !== '') ||
                        (sanityMaler && valgtÅrsak !== '' && !valgtÅrsak.includes('25 %'))) && (
                        <>
                            <SkjønnsfastsettingArbeidsgivere
                                arbeidsgivere={aktiveArbeidsgivere}
                                sammenligningsgrunnlag={avrundetSammenligningsgrunnlag}
                                sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                            />
                            <SkjønnsfastsettingBegrunnelse
                                omregnetÅrsinntekt={omregnetÅrsinntekt}
                                sammenligningsgrunnlag={avrundetSammenligningsgrunnlag}
                            />
                        </>
                    )}
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
            return Math.round(((inntekt.omregnetArsinntekt?.belop ?? 0) + Number.EPSILON) * 100) / 100;
        case '1':
            return antallAktiveArbeidsgivere > 1
                ? 0
                : Math.round((totaltSammenligningsgrunnlag + Number.EPSILON) * 100) / 100;
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
