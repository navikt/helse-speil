import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { Alert, Button } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { Feiloppsummering } from '@components/Feiloppsummering';
import { ForklaringTextarea } from '@components/ForklaringTextarea';
import { TimeoutModal } from '@components/TimeoutModal';
import {
    ArbeidsgiverFragment,
    NyttInntektsforholdPeriodeFragment,
    OmregnetArsinntekt,
    PersonFragment,
} from '@io/graphql';
import {
    formErrorsTilFeilliste,
    stringIsNaN,
} from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/EditableInntekt';
import styles from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/EditableInntekt.module.css';
import { EditableInntektSlettLokaleOverstyringerModal } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/EditableInntektSlettLokaleOverstyringerModal';
import { Månedsbeløp } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/månedsbeløp/Månedsbeløp';
import { useLokaltMånedsbeløp } from '@state/arbeidsgiver';
import { inntektOgRefusjonState, usePostOverstyrtInntekt } from '@state/overstyring';
import type { OverstyrtInntektOgRefusjonDTO } from '@typer/overstyring';
import { finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt } from '@utils/sykefraværstilfelle';
import { avrundetToDesimaler } from '@utils/tall';

interface TilkommenInntektFormFields {
    manedsbelop: string;
    forklaring: string;
}

interface EditableTilkommenAGProps {
    person: PersonFragment;
    arbeidsgiver: ArbeidsgiverFragment;
    aktivPeriode: NyttInntektsforholdPeriodeFragment;
    omregnetÅrsinntekt: OmregnetArsinntekt;
    close: () => void;
    onEndre: (erEndret: boolean) => void;
}

export const EditableTilkommenAG = ({
    person,
    arbeidsgiver,
    aktivPeriode,
    omregnetÅrsinntekt,
    close,
    onEndre,
}: EditableTilkommenAGProps): ReactElement => {
    const form = useForm<TilkommenInntektFormFields>({ shouldFocusError: false, mode: 'onBlur' });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const lokaltMånedsbeløp = useLokaltMånedsbeløp(arbeidsgiver.organisasjonsnummer, aktivPeriode.skjaeringstidspunkt);
    const lokaleInntektoverstyringer = useRecoilValue(inntektOgRefusjonState);
    const [harIkkeSkjemaEndringer] = useState(false);
    const [showSlettLokaleOverstyringerModal, setShowSlettLokaleOverstyringerModal] = useState(false);

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
        const { manedsbelop, forklaring } = form.getValues();

        const overstyrtInntektOgRefusjon: OverstyrtInntektOgRefusjonDTO = {
            fødselsnummer: person.fodselsnummer,
            aktørId: person.aktorId,
            skjæringstidspunkt: aktivPeriode.skjaeringstidspunkt,
            arbeidsgivere: [
                {
                    organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                    begrunnelse: 'tilkommen',
                    forklaring: forklaring,
                    månedligInntekt: stringIsNaN(manedsbelop)
                        ? omregnetÅrsinntekt.manedsbelop
                        : Number.parseFloat(manedsbelop),
                    fraMånedligInntekt: omregnetÅrsinntekt.manedsbelop,
                    refusjonsopplysninger: [],
                    fraRefusjonsopplysninger: [],
                },
            ],
            vedtaksperiodeId: finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt(person.arbeidsgivere, aktivPeriode),
        };
        postOverstyring(overstyrtInntektOgRefusjon, arbeidsgiver.organisasjonsnummer);
    };

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
                    <ForklaringTextarea
                        description={`Begrunn hvorfor det er gjort endringer i tilkommen inntekt.\nTeksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.`}
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
                        <Button size="small" variant="secondary" type="submit" loading={isLoading}>
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
                            skjæringstidspunkt={aktivPeriode.skjaeringstidspunkt}
                        />
                    )}
                </div>
            </form>
        </FormProvider>
    );
};
