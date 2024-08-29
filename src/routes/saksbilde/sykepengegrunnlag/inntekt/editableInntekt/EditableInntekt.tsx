import dayjs from 'dayjs';
import React, { FormEvent, ReactElement, useEffect, useRef, useState } from 'react';
import {
    CustomElement,
    FieldErrors,
    FieldValues,
    FormProvider,
    UseFormClearErrors,
    UseFormSetError,
    useForm,
} from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { Alert, BodyShort, Button } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { Feiloppsummering, Skjemafeil } from '@components/Feiloppsummering';
import { ForklaringTextarea } from '@components/ForklaringTextarea';
import { TimeoutModal } from '@components/TimeoutModal';
import { Maybe, OmregnetArsinntekt, PersonFragment } from '@io/graphql';
import { getFørstePeriodeForSkjæringstidspunkt } from '@saksbilde/historikk/mapping';
import { Månedsbeløp } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/månedsbeløp/Månedsbeløp';
import {
    useArbeidsgiver,
    useLokaleRefusjonsopplysninger,
    useLokaltMånedsbeløp,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { inntektOgRefusjonState, useOverstyrtInntektMetadata, usePostOverstyrtInntekt } from '@state/overstyring';
import { useActivePeriod } from '@state/periode';
import type { OverstyrtInntektOgRefusjonDTO, Refusjonsopplysning } from '@typer/overstyring';
import { BegrunnelseForOverstyring } from '@typer/overstyring';
import { ActivePeriod, DateString } from '@typer/shared';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';
import { finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt } from '@utils/sykefraværstilfelle';
import { avrundetToDesimaler } from '@utils/tall';
import { isGhostPeriode } from '@utils/typeguards';

import { Begrunnelser } from '../Begrunnelser';
import { EditableInntektSlettLokaleOverstyringerModal } from './EditableInntektSlettLokaleOverstyringerModal';
import { OmregnetÅrsinntekt } from './OmregnetÅrsinntekt';
import { RefusjonSkjema } from './refusjon/RefusjonSkjema';
import { RefusjonFormFields } from './refusjon/useRefusjonFormField';

import styles from './EditableInntekt.module.css';

export interface InntektFormFields {
    begrunnelseId: string;
    forklaring: string;
    manedsbelop: string;
    refusjonsopplysninger: RefusjonFormFields[];
}

interface EditableInntektProps {
    person: PersonFragment;
    omregnetÅrsinntekt: OmregnetArsinntekt;
    begrunnelser: BegrunnelseForOverstyring[];
    organisasjonsnummer: string;
    skjæringstidspunkt: DateString;
    close: () => void;
    onEndre: (erEndret: boolean) => void;
}

export const EditableInntekt = ({
    person,
    omregnetÅrsinntekt,
    begrunnelser,
    organisasjonsnummer,
    skjæringstidspunkt,
    close,
    onEndre,
}: EditableInntektProps): ReactElement => {
    const form = useForm<InntektFormFields>({ shouldFocusError: false, mode: 'onBlur' });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const metadata = useOverstyrtInntektMetadata(skjæringstidspunkt, organisasjonsnummer);
    const arbeidsgiver = useArbeidsgiver(organisasjonsnummer);
    const period = usePeriodForSkjæringstidspunktForArbeidsgiver(skjæringstidspunkt, organisasjonsnummer);
    const valgtVedtaksperiode = useActivePeriod();
    const [harIkkeSkjemaEndringer, setHarIkkeSkjemaEndringer] = useState(false);
    const [showSlettLokaleOverstyringerModal, setShowSlettLokaleOverstyringerModal] = useState(false);
    const lokaleInntektoverstyringer = useRecoilValue(inntektOgRefusjonState);
    const lokaleRefusjonsopplysninger = useLokaleRefusjonsopplysninger(organisasjonsnummer, skjæringstidspunkt);
    const lokaltMånedsbeløp = useLokaltMånedsbeløp(organisasjonsnummer, skjæringstidspunkt);
    const førstePeriodeForSkjæringstidspunkt = getFørstePeriodeForSkjæringstidspunkt(skjæringstidspunkt, arbeidsgiver);

    const cancelEditing = () => {
        onEndre(false);
        close();
    };

    const { isLoading, error, postOverstyring, timedOut, setTimedOut } = usePostOverstyrtInntekt(
        cancelEditing,
        showSlettLokaleOverstyringerModal,
        setShowSlettLokaleOverstyringerModal,
    );

    const harFeil = !form.formState.isValid && form.formState.isSubmitted;
    const values = form.getValues();

    const månedsbeløp = Number.parseFloat(values.manedsbelop);
    const omregnetÅrsinntektMånedsbeløpRounded = avrundetToDesimaler(omregnetÅrsinntekt.manedsbelop);
    const harEndringer = !isNaN(månedsbeløp) && månedsbeløp !== omregnetÅrsinntektMånedsbeløpRounded;

    useEffect(() => {
        if (lokaltMånedsbeløp !== omregnetÅrsinntektMånedsbeløpRounded) {
            onEndre(true);
        }
    }, [omregnetÅrsinntekt]);

    useEffect(() => {
        if (!stringIsNaN(values.manedsbelop)) {
            onEndre(Number.parseFloat(values.manedsbelop) !== omregnetÅrsinntektMånedsbeløpRounded);
        }
    }, [values, omregnetÅrsinntekt]);

    useEffect(() => {
        harFeil && feiloppsummeringRef.current?.focus();
    }, [harFeil]);

    const confirmChanges = () => {
        const { begrunnelseId, forklaring, manedsbelop, refusjonsopplysninger } = form.getValues();
        const begrunnelse = begrunnelser.find((begrunnelse) => begrunnelse.id === begrunnelseId);

        if (begrunnelse === undefined) {
            throw 'Mangler begrunnelse for endring av inntekt';
        }

        const overstyrtInntektOgRefusjon: OverstyrtInntektOgRefusjonDTO = {
            fødselsnummer: metadata.fødselsnummer,
            aktørId: metadata.aktørId,
            skjæringstidspunkt: metadata.skjæringstidspunkt,
            arbeidsgivere: [
                {
                    organisasjonsnummer: metadata.organisasjonsnummer,
                    begrunnelse: begrunnelse.forklaring,
                    forklaring: forklaring,
                    månedligInntekt: stringIsNaN(manedsbelop)
                        ? omregnetÅrsinntekt.manedsbelop
                        : Number.parseFloat(manedsbelop),
                    fraMånedligInntekt: omregnetÅrsinntekt.manedsbelop,
                    refusjonsopplysninger: refusjonsopplysninger ?? [],
                    fraRefusjonsopplysninger: metadata.fraRefusjonsopplysninger,
                    ...(begrunnelse.lovhjemmel?.paragraf && {
                        lovhjemmel: {
                            paragraf: begrunnelse.lovhjemmel.paragraf,
                            ledd: begrunnelse.lovhjemmel?.ledd,
                            bokstav: begrunnelse.lovhjemmel?.bokstav,
                            lovverk: begrunnelse.lovhjemmel?.lovverk,
                            lovverksversjon: begrunnelse.lovhjemmel?.lovverksversjon,
                        },
                    }),
                },
            ],
            vedtaksperiodeId: finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt(
                person.arbeidsgivere,
                valgtVedtaksperiode!,
            ),
        };
        postOverstyring(overstyrtInntektOgRefusjon, metadata.organisasjonsnummer);
    };

    const validateRefusjon = refusjonsvalidator(
        period,
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
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <div className={styles.EditableInntekt}>
                    <Månedsbeløp
                        månedsbeløp={omregnetÅrsinntekt.manedsbelop}
                        kilde={omregnetÅrsinntekt.kilde}
                        lokaltMånedsbeløp={lokaltMånedsbeløp}
                        harEndringer={harEndringer}
                    />
                    <BodyShort className={styles.Warning}>Endringen vil gjelde fra skjæringstidspunktet</BodyShort>
                    <OmregnetÅrsinntekt
                        beløp={omregnetÅrsinntekt.belop}
                        kilde={omregnetÅrsinntekt.kilde}
                        harEndringer={harEndringer}
                    />
                    {metadata.fraRefusjonsopplysninger.length > 0 && (
                        <RefusjonSkjema
                            fraRefusjonsopplysninger={metadata.fraRefusjonsopplysninger}
                            lokaleRefusjonsopplysninger={lokaleRefusjonsopplysninger}
                        />
                    )}
                    <Begrunnelser begrunnelser={begrunnelser} />
                    <ForklaringTextarea
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
                    <span className={styles.Buttons}>
                        <Button
                            size="small"
                            variant="secondary"
                            type="submit"
                            loading={isLoading}
                            onClick={validateRefusjon}
                        >
                            Lagre
                        </Button>
                        <Button size="small" variant="tertiary" type="button" onClick={cancelEditing}>
                            Avbryt
                        </Button>
                    </span>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {timedOut && <TimeoutModal showModal={timedOut} onClose={() => setTimedOut(false)} />}
                    {showSlettLokaleOverstyringerModal && (
                        <EditableInntektSlettLokaleOverstyringerModal
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
                </div>
            </form>
        </FormProvider>
    );
};

const stringIsNaN = (value: string | undefined): boolean => Number.isNaN(Number.parseFloat(value ?? 'NaN'));

interface RefMedId extends CustomElement<FieldValues> {
    id?: string;
}

const formErrorsTilFeilliste = (errors: FieldErrors<InntektFormFields>): Skjemafeil[] =>
    Object.entries(errors)
        .map(([id, error]) => ({
            id: (error?.ref as RefMedId)?.id ?? id,
            melding: error.message ?? id,
        }))
        .flat();

const refusjonsvalidator =
    (
        period: Maybe<ActivePeriod>,
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
        if (isGhostPeriode(period)) {
            handleSubmit(confirmChanges);
            return;
        }

        const refusjonsopplysninger =
            values?.refusjonsopplysninger &&
            [...values.refusjonsopplysninger].sort(
                (a: Refusjonsopplysning, b: Refusjonsopplysning) =>
                    new Date(b.fom).getTime() - new Date(a.fom).getTime(),
            );

        const harEndretRefusjonsopplysninger =
            JSON.stringify(refusjonsopplysninger) !== JSON.stringify(fraRefusjonsopplysninger);
        const harEndretMånedsbeløp =
            omregnetÅrsinntektBeløp !== Number(values?.manedsbelop) && !stringIsNaN(values?.manedsbelop);

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
                : (dayjs(refusjonsopplysninger?.[0]?.tom, ISO_DATOFORMAT).isBefore(period?.tom) ?? true);

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

        const manglerRefusjonsopplysninger: boolean = refusjonsopplysninger.length === 0;

        sisteTomErFørPeriodensTom &&
            setError('refusjonsopplysninger', {
                type: 'custom',
                message: 'Siste til og med dato kan ikke være før periodens til og med dato.',
            });

        førsteFomErEtterFørstePeriodesFom &&
            setError('refusjonsopplysninger', {
                type: 'custom',
                message: `Tidligste fra og med dato for refusjon må være lik eller før ${dayjs(
                    førstePeriodeForSkjæringstidspunktFom,
                    ISO_DATOFORMAT,
                ).format(NORSK_DATOFORMAT)}`,
            });

        erGapIDatoer &&
            setError('refusjonsopplysninger', {
                type: 'custom',
                message: 'Refusjonsdatoene må være sammenhengende.',
            });

        manglerRefusjonsopplysninger &&
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
