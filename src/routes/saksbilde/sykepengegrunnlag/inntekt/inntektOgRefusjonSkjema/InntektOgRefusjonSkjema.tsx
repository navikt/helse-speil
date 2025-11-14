import React, { ReactElement, useRef, useState } from 'react';
import {
    CustomElement,
    FieldErrors,
    FieldValues,
    FormProvider,
    useController,
    useForm,
    useFormContext,
} from 'react-hook-form';

import { Button, HStack, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react';

import {
    InntektOgRefusjonSchema,
    RefusjonsperiodeSchema,
    lagInntektOgRefusjonSchema,
    sorter,
} from '@/form-schemas/inntektOgRefusjonSkjema';
import { Feiloppsummering, Skjemafeil } from '@components/Feiloppsummering';
import { zodResolver } from '@hookform/resolvers/zod';
import { Arbeidsgiver, InntektFraAOrdningen, Kildetype, OmregnetArsinntekt, PersonFragment } from '@io/graphql';
import { OmregnetÅrsinntekt } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/OmregetÅrsinntekt';
import { SisteTolvMånedersInntekt } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/SisteTolvMånedersInntekt';
import { RefusjonSkjema } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/RefusjonSkjema';
import { SlettLokaleOverstyringerModal } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/SlettLokaleOverstyringerModal';
import { Månedsbeløp } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/månedsbeløp/Månedsbeløp';
import { utledSykefraværstilfelleperioderForInntektsforhold } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import {
    useLokaleRefusjonsopplysninger,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/inntektsforhold/arbeidsgiver';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useInntektOgRefusjon, useLokaleInntektOverstyringer, useOverstyrtInntektMetadata } from '@state/overstyring';
import { useActivePeriod } from '@state/periode';
import { BegrunnelseForOverstyring, type OverstyrtInntektOgRefusjonDTO } from '@typer/overstyring';
import { DatePeriod, DateString } from '@typer/shared';
import { finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt } from '@utils/sykefraværstilfelle';
import { isGhostPeriode } from '@utils/typeguards';

interface InntektOgRefusjonSkjemaProps {
    person: PersonFragment;
    arbeidsgiver: Arbeidsgiver;
    skjæringstidspunkt: DateString;
    begrunnelser: BegrunnelseForOverstyring[];
    omregnetÅrsinntekt: OmregnetArsinntekt;
    inntektFraAOrdningen?: InntektFraAOrdningen[];
    inntekterForSammenligningsgrunnlag?: InntektFraAOrdningen[];
    erDeaktivert: Boolean;
    inntektFom: DateString | null;
    inntektTom: DateString | null;
    lukkSkjema: () => void;
}

export const InntektOgRefusjonSkjema = ({
    person,
    arbeidsgiver,
    skjæringstidspunkt,
    begrunnelser,
    omregnetÅrsinntekt,
    inntektFraAOrdningen,
    inntekterForSammenligningsgrunnlag,
    erDeaktivert,
    inntektFom,
    inntektTom,
    lukkSkjema,
}: InntektOgRefusjonSkjemaProps) => {
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);

    const sykefraværstilfelle: DatePeriod = utledSykefraværstilfelleperioderForInntektsforhold([arbeidsgiver]).find(
        (periode) => periode.fom === skjæringstidspunkt,
    ) ?? { fom: '', tom: '' };

    const lokaleRefusjonsopplysninger = useLokaleRefusjonsopplysninger(
        arbeidsgiver.organisasjonsnummer,
        skjæringstidspunkt,
    );

    const periode = usePeriodForSkjæringstidspunktForArbeidsgiver(
        person,
        skjæringstidspunkt,
        arbeidsgiver.organisasjonsnummer,
    );
    const overstyringMetadata = useOverstyrtInntektMetadata(person, arbeidsgiver, periode);

    const defaultRefusjonsperioder = (
        lokaleRefusjonsopplysninger.length > 0
            ? lokaleRefusjonsopplysninger
            : overstyringMetadata.fraRefusjonsopplysninger
    ).sort((a, b) => sorter(a.fom, b.fom));

    const form = useForm<InntektOgRefusjonSchema>({
        resolver: zodResolver(
            lagInntektOgRefusjonSchema(
                sykefraværstilfelle,
                begrunnelser.map((begrunnelse) => begrunnelse.id),
            ),
        ),
        defaultValues: {
            månedsbeløp: omregnetÅrsinntekt.manedsbelop,
            refusjonsperioder: defaultRefusjonsperioder,
            begrunnelse: '',
            notat: '',
        },
    });

    const [showSlettLokaleOverstyringerModal, setShowSlettLokaleOverstyringerModal] = useState(false);
    const lokaleInntektoverstyringer = useInntektOgRefusjon();

    const setLokalInntektOverstyring = useLokaleInntektOverstyringer(
        person,
        showSlettLokaleOverstyringerModal,
        setShowSlettLokaleOverstyringerModal,
    );

    const valgtVedtaksperiode = useActivePeriod(person);
    const period = usePeriodForSkjæringstidspunktForArbeidsgiver(
        person,
        skjæringstidspunkt,
        arbeidsgiver.organisasjonsnummer,
    );
    const metadata = useOverstyrtInntektMetadata(person, arbeidsgiver, period);

    const handleSubmit = () => {
        const { begrunnelse, månedsbeløp, notat, refusjonsperioder } = form.getValues();
        const valgtBegrunnelse = begrunnelser.find((begrunnelseInnslag) => begrunnelseInnslag.id === begrunnelse);

        if (valgtBegrunnelse === undefined) {
            throw 'Mangler begrunnelse for endring av inntekt';
        }
        if (valgtVedtaksperiode == undefined) {
            throw 'Mangler valgt vedtaksperiode';
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
                valgtVedtaksperiode,
            ),
        };
        setLokalInntektOverstyring(overstyrtInntektOgRefusjon, metadata.organisasjonsnummer);
        lukkSkjema();
    };

    const visFeilOppsummering =
        !form.formState.isValid && form.formState.isSubmitted && Object.entries(form.formState.errors).length > 0;

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <VStack gap="4">
                    <Månedsbeløp månedsbeløp={omregnetÅrsinntekt.manedsbelop} kilde={omregnetÅrsinntekt.kilde} />
                    <OmregnetÅrsinntekt omregnetÅrsintekt={omregnetÅrsinntekt?.belop} gap="16" />
                    <RefusjonSkjema inntektFom={inntektFom} inntektTom={inntektTom} />
                    <SisteTolvMånedersInntekt
                        skjæringstidspunkt={skjæringstidspunkt}
                        inntektFraAOrdningen={inntektFraAOrdningen}
                        erAktivGhost={isGhostPeriode(period) && !erDeaktivert}
                        inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
                    />
                    <Begrunnelse begrunnelser={begrunnelser} />
                    <Notat />
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
                        <Button size="small" variant="tertiary" type="button" onClick={lukkSkjema}>
                            Avbryt
                        </Button>
                    </HStack>
                    {showSlettLokaleOverstyringerModal && (
                        <SlettLokaleOverstyringerModal
                            showModal={showSlettLokaleOverstyringerModal}
                            onApprove={() => {
                                form.handleSubmit(handleSubmit);
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

const formErrorsTilFeilliste = (errors: FieldErrors<InntektOgRefusjonSchema>): Skjemafeil[] =>
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

const refusjonFormErrorsTilFeilliste = (errors: FieldErrors<RefusjonsperiodeSchema>[]): Skjemafeil[] =>
    errors
        .filter((theError) => theError != null)
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

const isRefusjonFormFieldsErrors = (error?: unknown): error is FieldErrors<RefusjonsperiodeSchema>[] => {
    return error !== undefined && error !== null && (error as FieldErrors<RefusjonsperiodeSchema>[]).length > 0;
};

interface RefMedId extends CustomElement<FieldValues> {
    id?: string;
}

interface BegrunnelseProps {
    begrunnelser: BegrunnelseForOverstyring[];
}

function Begrunnelse({ begrunnelser }: BegrunnelseProps): ReactElement {
    const { control } = useFormContext<InntektOgRefusjonSchema>();
    const { field, fieldState } = useController({ name: 'begrunnelse', control });

    return (
        <RadioGroup legend="Begrunnelse" size="small" error={fieldState.error?.message} {...field}>
            {begrunnelser.map((begrunnelse) => (
                <Radio value={begrunnelse.id} key={begrunnelse.id}>
                    {begrunnelse.forklaring}
                </Radio>
            ))}
        </RadioGroup>
    );
}

function Notat(): ReactElement {
    const { control } = useFormContext<InntektOgRefusjonSchema>();
    const { field, fieldState } = useController({ name: 'notat', control });

    return (
        <Textarea
            label="Notat til beslutter"
            size="small"
            description="Begrunn hvorfor det er gjort endringer i inntekt og/eller refusjon. Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn."
            error={fieldState.error?.message}
            {...field}
        ></Textarea>
    );
}
