import { SkjønnsfastsettingBegrunnelse } from './SkjønnsfastsettingBegrunnelse';
import { SkjønnsfastsettingType } from './SkjønnsfastsettingType';
import { SkjønnsfastsettingÅrsak } from './SkjønnsfastsettingÅrsak';
import { SkjønnsfastsettingArbeidsgivere } from './arbeidsgivere/SkjønnsfastsettingArbeidsgivere';
import React, { useEffect, useRef } from 'react';
import { FieldErrors, FormProvider, useForm, useWatch } from 'react-hook-form';
import { CustomElement, FieldValues } from 'react-hook-form/dist/types/fields';

import { Button, Loader } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { TimeoutModal } from '@components/TimeoutModal';
import { Arbeidsgiverinntekt } from '@io/graphql';
import { SkjønnsfastsattSykepengegrunnlagDTO } from '@io/http';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import {
    isBeregnetPeriode,
    isSykepengegrunnlagskjønnsfastsetting,
    isUberegnetVilkarsprovdPeriode,
} from '@utils/typeguards';

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
    const period = useActivePeriod();
    const person = useCurrentPerson();

    const aktiveArbeidsgivere =
        person?.arbeidsgivere.filter(
            (arbeidsgiver) =>
                inntekter.find((inntekt) => inntekt.arbeidsgiver === arbeidsgiver.organisasjonsnummer)
                    ?.omregnetArsinntekt !== null,
        ) ?? [];

    const aktiveArbeidsgivereInntekter = inntekter.filter((inntekt) =>
        aktiveArbeidsgivere.some(
            (arbeidsgiver) =>
                arbeidsgiver.organisasjonsnummer === inntekt.arbeidsgiver && inntekt.omregnetArsinntekt !== null,
        ),
    );

    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const arbeidsgiver = useCurrentArbeidsgiver();

    const erReturoppgave = (period as BeregnetPeriode)?.totrinnsvurdering?.erRetur ?? false;
    const forrigeSkjønnsfastsettelse = erReturoppgave
        ? arbeidsgiver?.overstyringer
              .filter(isSykepengegrunnlagskjønnsfastsetting)
              .filter((overstyring) => !overstyring.ferdigstilt)
              .pop()
        : undefined;
    const forrigeSkjønnsfastsettelseFritekst = forrigeSkjønnsfastsettelse?.skjonnsfastsatt?.begrunnelseFritekst ?? '';
    const forrigeBegrunnelseId = skjønnsfastsettelseBegrunnelser().find(
        (begrunnelse) => begrunnelse.type.replace('Å', 'A') === forrigeSkjønnsfastsettelse?.skjonnsfastsatt?.type,
    )?.id;

    const form = useForm<SkjønnsfastsettingFormFields>({
        shouldFocusError: false,
        mode: 'onBlur',
        values: {
            begrunnelseFritekst: forrigeSkjønnsfastsettelseFritekst,
            begrunnelseId: forrigeBegrunnelseId ?? '',
            årsak: 'Skjønnsfastsetting ved mer enn 25% avvik',
            arbeidsgivere: aktiveArbeidsgivereInntekter.map((inntekt) => ({
                organisasjonsnummer: inntekt.arbeidsgiver,
                årlig: 0,
            })),
        },
    });

    const valgtBegrunnelseId = useWatch({
        name: 'begrunnelseId',
        defaultValue: forrigeBegrunnelseId,
        control: form.control,
    });

    const valgtInntekt = (inntekt: Arbeidsgiverinntekt, begrunnelseId?: string): number => {
        switch (begrunnelseId) {
            case '0':
                return inntekt.omregnetArsinntekt?.belop ?? 0;
            case '1':
                return inntekt.sammenligningsgrunnlag?.belop ?? 0;
            case '2':
            default:
                return 0;
        }
    };

    useEffect(() => {
        form.setValue(
            'arbeidsgivere',
            aktiveArbeidsgivereInntekter.map((inntekt) => ({
                organisasjonsnummer: inntekt.arbeidsgiver,
                årlig: valgtInntekt(inntekt, valgtBegrunnelseId),
            })),
        );
    }, [valgtBegrunnelseId]);

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

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <div className={styles.skjønnsfastsetting}>
                    <SkjønnsfastsettingÅrsak />
                    <SkjønnsfastsettingType />
                    <SkjønnsfastsettingArbeidsgivere inntekter={inntekter} arbeidsgivere={aktiveArbeidsgivere} />
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

const formErrorsTilFeilliste = (errors: FieldErrors<SkjønnsfastsettingFormFields>): Skjemafeil[] =>
    Object.entries(errors).map(([id, error]) => {
        return {
            id: (error?.ref as RefMedId)?.id ?? id,
            melding: ((error as Array<unknown>)?.length !== undefined ? error?.root?.message : error.message) ?? id,
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
            type: begrunnelse?.type,
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
