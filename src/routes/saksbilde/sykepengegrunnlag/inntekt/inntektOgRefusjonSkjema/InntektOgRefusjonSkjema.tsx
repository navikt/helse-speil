import dayjs from 'dayjs';
import { FormEvent, ReactElement, useEffect, useRef, useState } from 'react';
import {
    CustomElement,
    FieldErrors,
    FieldValues,
    FormProvider,
    UseFormClearErrors,
    UseFormSetError,
    useForm,
    useWatch,
} from 'react-hook-form';

import { Alert, Button, HStack } from '@navikt/ds-react';

import { BegrunnelseTextarea } from '@components/BegrunnelseTextarea';
import { Feiloppsummering, Skjemafeil } from '@components/Feiloppsummering';
import { Arbeidsgiver, InntektFraAOrdningen, OmregnetArsinntekt, PersonFragment } from '@io/graphql';
import { getFørstePeriodeForSkjæringstidspunkt } from '@saksbilde/historikk/mapping';
import { OmregnetÅrsinntekt } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/OmregetÅrsinntekt';
import { SisteTolvMånedersInntekt } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/SisteTolvMånedersInntekt';
import { Månedsbeløp } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/månedsbeløp/Månedsbeløp';
import {
    finnSistePeriodeForSkjæringstidspunkt,
    harSykefraværMedSkjæringstidspunkt,
    useLokaleRefusjonsopplysninger,
    useLokaltMånedsbeløp,
} from '@state/inntektsforhold/arbeidsgiver';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { lagOverstyrtInntektMetadata, useInntektOgRefusjon, useLokaleInntektOverstyringer } from '@state/overstyring';
import { useActivePeriod } from '@state/periode';
import type { OverstyrtInntektOgRefusjonDTO, Refusjonsopplysning } from '@typer/overstyring';
import { ÅrsakForOverstyring } from '@typer/overstyring';
import { DateString } from '@typer/shared';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';
import { finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt } from '@utils/sykefraværstilfelle';
import { avrundetToDesimaler } from '@utils/tall';

import { Arsaker } from '../Arsaker';
import { SlettLokaleOverstyringerDialog } from './SlettLokaleOverstyringerDialog';
import { RefusjonSkjema } from './refusjon/RefusjonSkjema/RefusjonSkjema';
import { RefusjonFormFields } from './refusjon/hooks/useRefusjonFormField';

import styles from './InntektOgRefusjonSkjema.module.css';

export interface InntektFormFields {
    årsakId: string;
    begrunnelse: string;
    manedsbelop: string;
    refusjonsopplysninger: RefusjonFormFields[];
}

interface EditableInntektProps {
    person: PersonFragment;
    arbeidsgiver: Arbeidsgiver;
    omregnetÅrsinntekt: OmregnetArsinntekt;
    årsaker: ÅrsakForOverstyring[];
    skjæringstidspunkt: DateString;
    vilkårsgrunnlagId?: string | null;
    inntektFraAOrdningen?: InntektFraAOrdningen[];
    inntekterForSammenligningsgrunnlag?: InntektFraAOrdningen[];
    inntektFom: string | null;
    inntektTom: string | null;
    close: () => void;
    harEndring: (erEndret: boolean) => void;
    erDeaktivert: boolean;
}

export const InntektOgRefusjonSkjema = ({
    person,
    arbeidsgiver,
    omregnetÅrsinntekt,
    årsaker,
    skjæringstidspunkt,
    vilkårsgrunnlagId,
    inntektFraAOrdningen,
    inntekterForSammenligningsgrunnlag,
    inntektFom,
    inntektTom,
    close,
    harEndring,
    erDeaktivert,
}: EditableInntektProps): ReactElement => {
    const form = useForm<InntektFormFields>({ shouldFocusError: false, mode: 'onSubmit', reValidateMode: 'onBlur' });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const sistePeriodeForSkjæringstidspunkt = finnSistePeriodeForSkjæringstidspunkt(arbeidsgiver, skjæringstidspunkt);
    const utenSykefravær = !harSykefraværMedSkjæringstidspunkt(arbeidsgiver, skjæringstidspunkt);
    const metadata = lagOverstyrtInntektMetadata(person, arbeidsgiver, skjæringstidspunkt, vilkårsgrunnlagId);
    const valgtVedtaksperiode = useActivePeriod(person);
    const [harIkkeSkjemaEndringer, setHarIkkeSkjemaEndringer] = useState(false);
    const [showSlettLokaleOverstyringerModal, setShowSlettLokaleOverstyringerModal] = useState(false);
    const lokaleInntektoverstyringer = useInntektOgRefusjon();
    const lokaleRefusjonsopplysninger = useLokaleRefusjonsopplysninger(
        arbeidsgiver.organisasjonsnummer,
        skjæringstidspunkt,
    );
    const månedsbeløp = Number.parseFloat(useWatch({ name: 'manedsbelop', control: form.control }));
    const lokaltMånedsbeløp = useLokaltMånedsbeløp(arbeidsgiver.organisasjonsnummer, skjæringstidspunkt);
    const førstePeriodeForSkjæringstidspunkt = getFørstePeriodeForSkjæringstidspunkt(skjæringstidspunkt, arbeidsgiver);

    const cancelEditing = () => {
        harEndring(false);
        close();
    };

    const setLokalInntektOverstyring = useLokaleInntektOverstyringer(
        person,
        showSlettLokaleOverstyringerModal,
        setShowSlettLokaleOverstyringerModal,
    );

    const harFeil = !form.formState.isValid && form.formState.isSubmitted;
    const values = form.getValues();

    const omregnetÅrsinntektMånedsbeløpRounded = avrundetToDesimaler(omregnetÅrsinntekt.manedsbelop);
    const harEndringer =
        (!!lokaltMånedsbeløp && lokaltMånedsbeløp !== omregnetÅrsinntektMånedsbeløpRounded) ||
        (!isNaN(månedsbeløp) && månedsbeløp !== omregnetÅrsinntektMånedsbeløpRounded);

    useEffect(() => {
        harEndring(harEndringer);
    }, [harEndringer, harEndring]);

    useEffect(() => {
        if (harFeil) feiloppsummeringRef.current?.focus();
    }, [harFeil]);

    const confirmChanges = () => {
        const { årsakId, begrunnelse, manedsbelop, refusjonsopplysninger } = form.getValues();
        const årsak = årsaker.find((årsak) => årsak.id === årsakId);

        if (årsak === undefined) {
            throw 'Mangler årsak for endring av inntekt';
        }

        const overstyrtInntektOgRefusjon: OverstyrtInntektOgRefusjonDTO = {
            fødselsnummer: metadata.fødselsnummer,
            aktørId: metadata.aktørId,
            skjæringstidspunkt: metadata.skjæringstidspunkt,
            arbeidsgivere: [
                {
                    organisasjonsnummer: metadata.organisasjonsnummer,
                    begrunnelse: årsak.forklaring,
                    forklaring: begrunnelse,
                    månedligInntekt:
                        stringIsNaN(manedsbelop) ||
                        Math.abs(avrundetToDesimaler(omregnetÅrsinntekt.manedsbelop) - Number.parseFloat(manedsbelop)) <
                            0.01
                            ? omregnetÅrsinntekt.manedsbelop
                            : Number.parseFloat(manedsbelop),
                    fraMånedligInntekt: omregnetÅrsinntekt.manedsbelop,
                    refusjonsopplysninger: refusjonsopplysninger ?? [],
                    fraRefusjonsopplysninger: metadata.fraRefusjonsopplysninger,
                    ...(årsak.lovhjemmel?.paragraf && {
                        lovhjemmel: {
                            paragraf: årsak.lovhjemmel.paragraf,
                            ledd: årsak.lovhjemmel?.ledd,
                            bokstav: årsak.lovhjemmel?.bokstav,
                            lovverk: årsak.lovhjemmel?.lovverk,
                            lovverksversjon: årsak.lovhjemmel?.lovverksversjon,
                        },
                    }),
                    fom: inntektFom,
                    tom: inntektTom,
                },
            ],
            vedtaksperiodeId: finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt(
                finnAlleInntektsforhold(person),
                valgtVedtaksperiode!,
            ),
        };
        setLokalInntektOverstyring(overstyrtInntektOgRefusjon, metadata.organisasjonsnummer);
        cancelEditing();
    };

    const validateRefusjon = refusjonsvalidator(
        utenSykefravær,
        sistePeriodeForSkjæringstidspunkt?.tom,
        values,
        metadata.fraRefusjonsopplysninger,
        omregnetÅrsinntekt.manedsbelop,
        setHarIkkeSkjemaEndringer,
        confirmChanges,
        form.handleSubmit,
        form.setError,
        form.clearErrors,
        førstePeriodeForSkjæringstidspunkt?.fom,
    );

    const visFeilOppsummering =
        !form.formState.isValid && form.formState.isSubmitted && Object.entries(form.formState.errors).length > 0;

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)} autoComplete="off">
                <div className={styles.EditableInntekt}>
                    <Månedsbeløp
                        månedsbeløp={omregnetÅrsinntekt.manedsbelop}
                        kilde={omregnetÅrsinntekt.kilde}
                        lokaltMånedsbeløp={lokaltMånedsbeløp}
                        harEndringer={harEndringer}
                        feilmelding={form.formState.errors.manedsbelop?.message}
                    />
                    <OmregnetÅrsinntekt omregnetÅrsintekt={omregnetÅrsinntekt?.belop} gap="space-64" />
                    {!utenSykefravær && (
                        <RefusjonSkjema
                            fraRefusjonsopplysninger={metadata.fraRefusjonsopplysninger}
                            lokaleRefusjonsopplysninger={lokaleRefusjonsopplysninger}
                        />
                    )}
                    <SisteTolvMånedersInntekt
                        skjæringstidspunkt={skjæringstidspunkt}
                        inntektFraAOrdningen={inntektFraAOrdningen}
                        erAktivGhost={utenSykefravær && !erDeaktivert}
                        inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
                    />
                    <Arsaker årsaker={årsaker} />
                    <BegrunnelseTextarea
                        description={`Begrunn hvorfor det er gjort endringer i inntekt og/eller refusjon.\nTeksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.`}
                    />
                    {visFeilOppsummering && (
                        <Feiloppsummering
                            feiloppsummeringRef={feiloppsummeringRef}
                            feilliste={formErrorsTilFeilliste(form.formState.errors)}
                        />
                    )}
                    {harIkkeSkjemaEndringer && (
                        <Alert variant="warning" className={styles.WarningIngenSkjemaEndringer}>
                            Du har ikke endret månedsinntekt eller refusjonsopplysninger
                        </Alert>
                    )}
                    <HStack gap="space-8">
                        <Button size="small" variant="secondary" type="submit" onClick={validateRefusjon}>
                            Lagre
                        </Button>
                        <Button size="small" variant="tertiary" type="button" onClick={cancelEditing}>
                            Avbryt
                        </Button>
                    </HStack>
                    <SlettLokaleOverstyringerDialog
                        open={showSlettLokaleOverstyringerModal}
                        onOpenChange={setShowSlettLokaleOverstyringerModal}
                        onApprove={() => form.handleSubmit(confirmChanges)}
                        overstyrtSkjæringstidspunkt={lokaleInntektoverstyringer.skjæringstidspunkt}
                        skjæringstidspunkt={skjæringstidspunkt}
                    />
                </div>
            </form>
        </FormProvider>
    );
};

export const stringIsNaN = (value: string | undefined): boolean => Number.isNaN(Number.parseFloat(value ?? 'NaN'));

interface RefMedId extends CustomElement<FieldValues> {
    id?: string;
}

export const formErrorsTilFeilliste = (errors: FieldErrors<InntektFormFields>): Skjemafeil[] =>
    Object.entries(errors)
        .map(([id, error]) => ({
            id: (error as { ref?: RefMedId } | undefined)?.ref?.id ?? id,
            melding: error.message ?? id,
        }))
        .flat();

const refusjonsvalidator =
    (
        utenSykdom: boolean,
        sistePeriodeTom: DateString | undefined,
        values: InntektFormFields,
        fraRefusjonsopplysninger: Refusjonsopplysning[],
        omregnetÅrsinntektBeløp: number,
        setHarIkkeSkjemaEndringer: (harEndringer: boolean) => void,
        confirmChanges: () => void,
        handleSubmit: (handler: () => void) => void,
        setError: UseFormSetError<InntektFormFields>,
        clearErrors: UseFormClearErrors<InntektFormFields>,
        førstePeriodeForSkjæringstidspunktFom?: string,
    ) =>
    (e: FormEvent) => {
        if (utenSykdom) {
            handleSubmit(confirmChanges);
            return;
        }

        const refusjonsopplysninger =
            values?.refusjonsopplysninger &&
            [...values.refusjonsopplysninger].sort(
                (a: Refusjonsopplysning, b: Refusjonsopplysning) =>
                    new Date(b.fom).getTime() - new Date(a.fom).getTime(),
            );

        const endretRefusjonsopplysninger = (
            refusjonsopplysninger: Refusjonsopplysning[],
            fraRefusjonsopplysninger: Refusjonsopplysning[],
        ): boolean => {
            for (const refusjonsopplysning of refusjonsopplysninger) {
                const match = fraRefusjonsopplysninger.find(
                    (fraRefusjon) =>
                        fraRefusjon.fom === refusjonsopplysning.fom &&
                        fraRefusjon.tom === refusjonsopplysning.tom &&
                        Math.abs(fraRefusjon.beløp - refusjonsopplysning.beløp) < 0.01 &&
                        fraRefusjon.kilde === refusjonsopplysning.kilde,
                );
                if (!match) {
                    return true;
                }
            }
            return false;
        };

        const harEndretRefusjonsopplysninger = endretRefusjonsopplysninger(
            refusjonsopplysninger,
            fraRefusjonsopplysninger,
        );
        const harEndretMånedsbeløp =
            Math.abs(avrundetToDesimaler(omregnetÅrsinntektBeløp) - Number(values?.manedsbelop)) > 0.01 &&
            !stringIsNaN(values?.manedsbelop);

        if (!harEndretMånedsbeløp && !harEndretRefusjonsopplysninger) {
            e.preventDefault();
            setHarIkkeSkjemaEndringer(true);
            return;
        } else if (harEndretMånedsbeløp && !harEndretRefusjonsopplysninger) {
            handleSubmit(confirmChanges);
            return;
        } else {
            setHarIkkeSkjemaEndringer(false);
        }

        clearErrors(['refusjonsopplysninger']);

        const sisteTomErFørPeriodensTom: boolean =
            refusjonsopplysninger?.[0]?.tom === null
                ? false
                : (dayjs(refusjonsopplysninger?.[0]?.tom, ISO_DATOFORMAT).isBefore(sistePeriodeTom) ?? true);

        const førsteFomErEtterFørstePeriodesFom: boolean = dayjs(
            refusjonsopplysninger?.[refusjonsopplysninger.length - 1]?.fom,
            ISO_DATOFORMAT,
        ).isAfter(førstePeriodeForSkjæringstidspunktFom);

        const erGapIDatoer: boolean = refusjonsopplysninger?.some(
            (refusjonsopplysning: Refusjonsopplysning, index: number) => {
                const isNotLast = index < refusjonsopplysninger.length - 1;
                const currentFom = dayjs(refusjonsopplysning.fom, ISO_DATOFORMAT);
                const previousTom = dayjs(refusjonsopplysninger[index + 1]?.tom ?? '1970-01-01', ISO_DATOFORMAT);
                return isNotLast && currentFom.subtract(1, 'day').diff(previousTom) !== 0;
            },
        );

        const manglerRefusjonsopplysninger: boolean = !refusjonsopplysninger || refusjonsopplysninger.length === 0;

        if (sisteTomErFørPeriodensTom)
            setError('refusjonsopplysninger', {
                type: 'custom',
                message: 'Siste til og med dato kan ikke være før periodens til og med dato.',
            });

        if (førsteFomErEtterFørstePeriodesFom)
            setError('refusjonsopplysninger', {
                type: 'custom',
                message: `Tidligste fra og med dato for refusjon må være lik eller før ${dayjs(
                    førstePeriodeForSkjæringstidspunktFom,
                    ISO_DATOFORMAT,
                ).format(NORSK_DATOFORMAT)}`,
            });

        if (erGapIDatoer)
            setError('refusjonsopplysninger', {
                type: 'custom',
                message: 'Refusjonsdatoene må være sammenhengende.',
            });

        if (manglerRefusjonsopplysninger)
            setError('refusjonsopplysninger', { type: 'custom', message: 'Mangler refusjonsopplysninger' });

        if (
            !sisteTomErFørPeriodensTom &&
            !førsteFomErEtterFørstePeriodesFom &&
            !erGapIDatoer &&
            !manglerRefusjonsopplysninger
        ) {
            handleSubmit(confirmChanges);
        }
    };
