import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Controller, CustomElement, FieldErrors, FieldValues, FormProvider, useForm } from 'react-hook-form';

import { Button, HStack, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react';

import { InntektOgRefusjonSchema, lagInntektOgRefusjonSchema, sorter } from '@/form-schemas/inntektOgRefusjonSkjema';
import { Feiloppsummering, Skjemafeil } from '@components/Feiloppsummering';
import { zodResolver } from '@hookform/resolvers/zod';
import { Arbeidsgiver, Kildetype, OmregnetArsinntekt, PersonFragment } from '@io/graphql';
import { formatterBegrunnelse } from '@saksbilde/sykepengegrunnlag/inntekt/Begrunnelser';
import { OmregnetÅrsinntekt } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/OmregetÅrsinntekt';
import { SisteTolvMånedersInntekt } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/SisteTolvMånedersInntekt';
import { Månedsbeløp } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/månedsbeløp/Månedsbeløp';
import {
    useLokaleRefusjonsopplysninger,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/inntektsforhold/arbeidsgiver';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useInntektOgRefusjon, useLokaleInntektOverstyringer, useOverstyrtInntektMetadata } from '@state/overstyring';
import { useActivePeriod } from '@state/periode';
import type { OverstyrtInntektOgRefusjonDTO } from '@typer/overstyring';
import { BegrunnelseForOverstyring } from '@typer/overstyring';
import { DateString } from '@typer/shared';
import { finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt } from '@utils/sykefraværstilfelle';
import { isGhostPeriode } from '@utils/typeguards';

import { SlettLokaleOverstyringerModal } from './SlettLokaleOverstyringerModal';
import { RefusjonSkjema } from './refusjon/RefusjonSkjema/RefusjonSkjema';
import { RefusjonFormFields } from './refusjon/hooks/useRefusjonFormField';

export interface InntektFormFields {
    begrunnelseId: string;
    forklaring: string;
    manedsbelop: string;
    refusjonsopplysninger: RefusjonFormFields[];
}

interface EditableInntektProps {
    person: PersonFragment;
    arbeidsgiver: Arbeidsgiver;
    omregnetÅrsinntekt: OmregnetArsinntekt;
    begrunnelser: BegrunnelseForOverstyring[];
    skjæringstidspunkt: DateString;
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
    begrunnelser,
    skjæringstidspunkt,
    inntektFraAOrdningen,
    inntekterForSammenligningsgrunnlag,
    inntektFom,
    inntektTom,
    close,
    harEndring,
    erDeaktivert,
}: EditableInntektProps): ReactElement => {
    const sykefraværstilfelle = person.arbeidsgivere
        .find((ag) => ag.organisasjonsnummer === arbeidsgiver.organisasjonsnummer)
        ?.generasjoner[0]?.perioder?.filter((periode) => periode.skjaeringstidspunkt === skjæringstidspunkt)
        .sort((a, b) => sorter(a.fom, b.fom));

    const lokaleRefusjonsopplysninger = useLokaleRefusjonsopplysninger(
        arbeidsgiver.organisasjonsnummer,
        skjæringstidspunkt,
    );
    const period = usePeriodForSkjæringstidspunktForArbeidsgiver(
        person,
        skjæringstidspunkt,
        arbeidsgiver.organisasjonsnummer,
    );
    const metadata = useOverstyrtInntektMetadata(person, arbeidsgiver, period);

    const form = useForm<InntektOgRefusjonSchema>({
        resolver: zodResolver(
            lagInntektOgRefusjonSchema(
                {
                    fom: sykefraværstilfelle?.[0]?.fom ?? '',
                    tom: sykefraværstilfelle?.[sykefraværstilfelle.length - 1]?.tom ?? '',
                },
                begrunnelser.map((begrunnelse) => begrunnelse.id),
            ),
        ),
        defaultValues: {
            månedsbeløp: omregnetÅrsinntekt.manedsbelop,
            begrunnelse: '',
            notat: '',
            refusjonsperioder: (
                (lokaleRefusjonsopplysninger.length > 0
                    ? lokaleRefusjonsopplysninger
                    : metadata.fraRefusjonsopplysninger) ?? []
            ).sort((a, b) => sorter(a.fom, b.fom)),
        },
        reValidateMode: 'onBlur',
        shouldFocusError: false,
        mode: 'onSubmit',
    });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);

    const valgtVedtaksperiode = useActivePeriod(person);
    const [showSlettLokaleOverstyringerModal, setShowSlettLokaleOverstyringerModal] = useState(false);
    const lokaleInntektoverstyringer = useInntektOgRefusjon();

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

    useEffect(() => {
        if (harFeil) feiloppsummeringRef.current?.focus();
    }, [harFeil]);

    const confirmChanges = () => {
        const { begrunnelse, månedsbeløp, notat, refusjonsperioder } = form.getValues();
        const valgtBegrunnelse = begrunnelser.find((begrunnelseInnslag) => begrunnelseInnslag.id === begrunnelse);

        if (valgtBegrunnelse === undefined) {
            throw 'Mangler begrunnelse for endring av inntekt';
        }

        const overstyrtInntektOgRefusjon: OverstyrtInntektOgRefusjonDTO = {
            fødselsnummer: metadata.fødselsnummer,
            aktørId: metadata.aktørId,
            skjæringstidspunkt: metadata.skjæringstidspunkt,
            arbeidsgivere: [
                {
                    organisasjonsnummer: metadata.organisasjonsnummer,
                    begrunnelse: valgtBegrunnelse.forklaring,
                    forklaring: notat,
                    månedligInntekt: månedsbeløp,
                    fraMånedligInntekt: omregnetÅrsinntekt.manedsbelop,
                    refusjonsopplysninger: refusjonsperioder.map((periode) => ({
                        fom: periode.fom,
                        tom: periode.tom,
                        beløp: periode.beløp,
                        kilde: Kildetype.Saksbehandler,
                    })),
                    fraRefusjonsopplysninger: metadata.fraRefusjonsopplysninger,
                    ...(valgtBegrunnelse.lovhjemmel?.paragraf && {
                        lovhjemmel: {
                            paragraf: valgtBegrunnelse.lovhjemmel.paragraf,
                            ledd: valgtBegrunnelse.lovhjemmel?.ledd,
                            bokstav: valgtBegrunnelse.lovhjemmel?.bokstav,
                            lovverk: valgtBegrunnelse.lovhjemmel?.lovverk,
                            lovverksversjon: valgtBegrunnelse.lovhjemmel?.lovverksversjon,
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

    const visFeilOppsummering =
        !form.formState.isValid && form.formState.isSubmitted && Object.entries(form.formState.errors).length > 0;

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)} autoComplete="off">
                <VStack gap="4">
                    <Månedsbeløp
                        form={form}
                        månedsbeløp={omregnetÅrsinntekt.manedsbelop}
                        kilde={omregnetÅrsinntekt.kilde}
                    />
                    <OmregnetÅrsinntekt omregnetÅrsintekt={omregnetÅrsinntekt?.belop} gap="16" />
                    {!isGhostPeriode(period) && (
                        <RefusjonSkjema
                            fraRefusjonsopplysninger={metadata.fraRefusjonsopplysninger}
                            lokaleRefusjonsopplysninger={lokaleRefusjonsopplysninger}
                            inntektFom={inntektFom}
                            inntektTom={inntektTom ?? inntektFom}
                        />
                    )}
                    <SisteTolvMånedersInntekt
                        skjæringstidspunkt={skjæringstidspunkt}
                        inntektFraAOrdningen={inntektFraAOrdningen}
                        erAktivGhost={isGhostPeriode(period) && !erDeaktivert}
                        inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
                    />
                    <Controller
                        control={form.control}
                        name="begrunnelse"
                        render={({ field, fieldState }) => (
                            <RadioGroup
                                {...field}
                                legend="Begrunnelse"
                                id="begrunnelse"
                                name="begrunnelse"
                                size="small"
                                error={fieldState.error?.message ?? null}
                            >
                                {begrunnelser.map((begrunnelse) => (
                                    <Radio value={begrunnelse.id} key={begrunnelse.id}>
                                        {formatterBegrunnelse(begrunnelse)}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="notat"
                        render={({ field, fieldState }) => (
                            <Textarea
                                {...field}
                                label="Notat til beslutter"
                                id="forklaring"
                                description={`Begrunn hvorfor det er gjort endringer i inntekt og/eller refusjon.\nTeksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.`}
                                error={fieldState.error?.message ?? null}
                                style={{ whiteSpace: 'pre-line' }}
                                size="small"
                            />
                        )}
                    />
                    <div>Her er det noe: {form.formState.errors.root?.message}</div>
                    {visFeilOppsummering && (
                        <Feiloppsummering
                            feiloppsummeringRef={feiloppsummeringRef}
                            feilliste={formErrorsTilFeilliste(form.formState.errors)}
                        />
                    )}
                    <HStack gap="2">
                        <Button size="small" variant="secondary" type="submit">
                            Lagre
                        </Button>
                        <Button size="small" variant="tertiary" type="button" onClick={cancelEditing}>
                            Avbryt
                        </Button>
                    </HStack>
                    {showSlettLokaleOverstyringerModal && (
                        <SlettLokaleOverstyringerModal
                            showModal={showSlettLokaleOverstyringerModal}
                            onApprove={() => {
                                form.handleSubmit(confirmChanges);
                                setShowSlettLokaleOverstyringerModal(false);
                            }}
                            onClose={() => setShowSlettLokaleOverstyringerModal(false)}
                            overstyrtSkjæringstidspunkt={lokaleInntektoverstyringer.skjæringstidspunkt}
                            skjæringstidspunkt={skjæringstidspunkt}
                        />
                    )}
                </VStack>
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
        .map(([id, error]) => {
            if (isRefusjonFormFieldsErrors(error)) {
                return refusjonFormErrorsTilFeilliste(error);
            }
            return {
                id: (error?.ref as RefMedId)?.id ?? id,
                melding: error.message ?? id,
            };
        })
        .flat();

const refusjonFormErrorsTilFeilliste = (errors: FieldErrors<RefusjonFormFields>[]): Skjemafeil[] =>
    errors
        .map((theError) =>
            Object.entries(theError)
                .map(([id, error]) => {
                    return {
                        id: (error?.ref as RefMedId)?.id ?? id,
                        melding: error.message ?? id,
                    };
                })
                .flat(),
        )
        .flat();

export const isRefusjonFormFieldsErrors = (error?: unknown): error is FieldErrors<RefusjonFormFields>[] => {
    return error !== undefined && error !== null && (error as FieldErrors<RefusjonFormFields>[]).length > 0;
};
