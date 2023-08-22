import { SkjønnsfastsettingBegrunnelse } from './SkjønnsfastsettingBegrunnelse';
import { SkjønnsfastsettingType } from './SkjønnsfastsettingType';
import { SkjønnsfastsettingÅrsak } from './SkjønnsfastsettingÅrsak';
import { SkjønnsfastsettingArbeidsgivere } from './arbeidsgivere/SkjønnsfastsettingArbeidsgivere';
import React, { useEffect, useRef } from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { CustomElement, FieldValues } from 'react-hook-form/dist/types/fields';

import { Button, Loader } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { TimeoutModal } from '@components/TimeoutModal';
import { Arbeidsgiverinntekt } from '@io/graphql';
import { SkjønnsfastsattSykepengegrunnlagDTO } from '@io/http';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { isBeregnetPeriode, isUberegnetVilkarsprovdPeriode } from '@utils/typeguards';

import { Feiloppsummering, Skjemafeil } from '../../inntekt/EditableInntekt/Feiloppsummering';
import {
    ArbeidsgiverForm,
    skjønnsfastsettelseBegrunnelser,
    usePostSkjønnsfastsattSykepengegrunnlag,
} from '../skjønnsfastsetting';

import styles from './SkjønnsfastsettingForm.module.css';

interface SkjønnsfastsettingFormFields {
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
    const form = useForm<SkjønnsfastsettingFormFields>({ shouldFocusError: false, mode: 'onBlur' });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const period = useActivePeriod();
    const person = useCurrentPerson();

    const cancelEditing = () => {
        setEditing(false);
    };

    const { isLoading, error, postSkjønnsfastsetting, timedOut, setTimedOut } =
        usePostSkjønnsfastsattSykepengegrunnlag(cancelEditing);

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

    if (!period || !person) return null;

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

    const validateArbeidsgiver = () => {
        // @ts-expect-error Feil måhøre til et felt

        form.clearErrors(['måVæreNumerisk', 'måEndreHvisSkjønsfastsattFinnes']);
        const values = form.getValues();

        const finnesIkkenumeriskÅrlig = values.arbeidsgivere.some((value) => !isNumeric(value.årlig.toString()));
        if (finnesIkkenumeriskÅrlig) {
            // @ts-expect-error Feil måhøre til et felt
            form.setError('måVæreNumerisk', {
                type: 'custom',
                message: 'Årsinntekt må være et beløp',
            });
        }

        const finnesKunSkjønnsfastsettelseTilAlleredeSkjønnsfastsattVerdi = !values.arbeidsgivere.some(
            (ag) =>
                ag.årlig !==
                inntekter.find((inntekt) => inntekt?.arbeidsgiver === ag.organisasjonsnummer)?.skjonnsmessigFastsatt
                    ?.belop,
        );
        if (finnesKunSkjønnsfastsettelseTilAlleredeSkjønnsfastsattVerdi) {
            // @ts-expect-error Feil måhøre til et felt
            form.setError('måEndreHvisSkjønsfastsattFinnes', {
                type: 'custom',
                message: 'Kan ikke skjønnsfastsette til allerede skjønnsfastsatt beløp',
            });
        }

        if (!finnesIkkenumeriskÅrlig && !finnesKunSkjønnsfastsettelseTilAlleredeSkjønnsfastsattVerdi) {
            form.handleSubmit(confirmChanges);
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <div className={styles.skjønnsfastsetting}>
                    <SkjønnsfastsettingÅrsak />
                    <SkjønnsfastsettingType />
                    <SkjønnsfastsettingArbeidsgivere inntekter={inntekter} arbeidsgivere={person.arbeidsgivere} />
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
                        <Button
                            className={styles.button}
                            variant="secondary"
                            size="small"
                            disabled={isLoading}
                            onClick={validateArbeidsgiver}
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

const isNumeric = (input: string) => /^\d+(\.\d{1,2})?$/.test(input);

interface RefMedId extends CustomElement<FieldValues> {
    id?: string;
}

const formErrorsTilFeilliste = (errors: FieldErrors<SkjønnsfastsettingFormFields>): Skjemafeil[] =>
    Object.entries(errors).map(([id, error]) => {
        const _id = error.type === 'custom' ? 'arbeidsgivere' : (error?.ref as RefMedId)?.id ?? id;
        return {
            id: _id,
            melding: error.message ?? id,
        };
    });

interface InitierendeVedtaksperiodeForArbeidsgiver {
    arbeidsgiver: string;
    initierendeVedtaksperiodeId: string | null;
}

const finnFørsteVilkårsprøvdePeriodePåSkjæringstidspunkt = (
    person: FetchedPerson,
    period: ActivePeriod,
): InitierendeVedtaksperiodeForArbeidsgiver[] =>
    person?.arbeidsgivere.flatMap((arbeidsgiver) => ({
        arbeidsgiver: arbeidsgiver.organisasjonsnummer,
        initierendeVedtaksperiodeId:
            arbeidsgiver.generasjoner?.[0]?.perioder
                ?.filter(
                    (periode) =>
                        periode.skjaeringstidspunkt === period.skjaeringstidspunkt &&
                        (isBeregnetPeriode(periode) || isUberegnetVilkarsprovdPeriode(periode)),
                )
                .pop()?.vedtaksperiodeId ?? null,
    }));

const skjønnsfastsettingFormToDto = (
    form: SkjønnsfastsettingFormFields,
    inntekter: Arbeidsgiverinntekt[],
    person: FetchedPerson,
    period: ActivePeriod,
    omregnetÅrsinntekt: number,
    sammenligningsgrunnlag: number,
): SkjønnsfastsattSykepengegrunnlagDTO => {
    const førsteVilkårsprøvdePeriodePåSkjæringstidspunkt = finnFørsteVilkårsprøvdePeriodePåSkjæringstidspunkt(
        person,
        period,
    );

    const manueltBeløp = form.arbeidsgivere.reduce((n: number, { årlig }: { årlig: number }) => n + årlig, 0);
    const begrunnelse = skjønnsfastsettelseBegrunnelser(omregnetÅrsinntekt, sammenligningsgrunnlag, manueltBeløp).find(
        (it) => it.id === form.begrunnelseId,
    );
    return {
        fødselsnummer: person.fodselsnummer,
        aktørId: person.aktorId,
        skjæringstidspunkt: period.skjaeringstidspunkt,
        arbeidsgivere: form.arbeidsgivere.map(({ årlig, organisasjonsnummer }: ArbeidsgiverForm) => ({
            organisasjonsnummer: organisasjonsnummer,
            årlig: årlig,
            fraÅrlig: inntekter.find((it) => it.arbeidsgiver === organisasjonsnummer)?.omregnetArsinntekt?.belop ?? 0,
            årsak: form.årsak,
            type: begrunnelse.type,
            begrunnelseMal: begrunnelse?.mal,
            begrunnelseFritekst: form.begrunnelseFritekst,
            ...(begrunnelse?.subsumsjon?.paragraf && {
                subsumsjon: {
                    paragraf: begrunnelse.subsumsjon.paragraf,
                    ledd: begrunnelse.subsumsjon?.ledd,
                    bokstav: begrunnelse.subsumsjon?.bokstav,
                },
            }),
            begrunnelseKonklusjon: begrunnelse?.konklusjon,
            initierendeVedtaksperiodeId:
                førsteVilkårsprøvdePeriodePåSkjæringstidspunkt.filter(
                    (it) => it.arbeidsgiver === organisasjonsnummer,
                )[0].initierendeVedtaksperiodeId ?? null,
        })),
    };
};
