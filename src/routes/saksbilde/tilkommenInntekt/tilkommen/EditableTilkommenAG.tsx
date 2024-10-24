import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Alert, Button } from '@navikt/ds-react';

import { Feiloppsummering } from '@components/Feiloppsummering';
import { ForklaringTextarea } from '@components/ForklaringTextarea';
import { ArbeidsgiverFragment, Maybe, NyttInntektsforholdPeriodeFragment, PersonFragment } from '@io/graphql';
import {
    formErrorsTilFeilliste,
    stringIsNaN,
} from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/InntektOgRefusjonSkjema';
import styles from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/InntektOgRefusjonSkjema.module.css';
import { SlettLokaleOverstyringerModal } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/SlettLokaleOverstyringerModal';
import { Månedsbeløp } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/månedsbeløp/Månedsbeløp';
import { useLokaltMånedsbeløp } from '@state/arbeidsgiver';
import { useInntektOgRefusjon, useLokaleInntektOverstyringer } from '@state/overstyring';
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
    periode: NyttInntektsforholdPeriodeFragment;
    close: () => void;
    onEndre: (erEndret: boolean) => void;
}

export const EditableTilkommenAG = ({
    person,
    arbeidsgiver,
    periode,
    close,
    onEndre,
}: EditableTilkommenAGProps): Maybe<ReactElement> => {
    const form = useForm<TilkommenInntektFormFields>({ shouldFocusError: false, mode: 'onBlur' });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const lokaltMånedsbeløp = useLokaltMånedsbeløp(arbeidsgiver.organisasjonsnummer, periode.skjaeringstidspunkt);
    const lokaleInntektoverstyringer = useInntektOgRefusjon();
    const [harIkkeSkjemaEndringer] = useState(false);
    const [showSlettLokaleOverstyringerModal, setShowSlettLokaleOverstyringerModal] = useState(false);

    const cancelEditing = () => {
        onEndre(false);
        close();
    };

    const setOverstyring = useLokaleInntektOverstyringer(
        person,
        showSlettLokaleOverstyringerModal,
        setShowSlettLokaleOverstyringerModal,
    );

    const harFeil = !form.formState.isValid && form.formState.isSubmitted;
    const values = form.getValues();
    const månedsbeløp = Number.parseFloat(values.manedsbelop);
    const omregnetÅrsinntektMånedsbeløpRounded = avrundetToDesimaler(periode.manedligBelop);
    const harEndringer = !isNaN(månedsbeløp) && månedsbeløp !== omregnetÅrsinntektMånedsbeløpRounded;

    useEffect(() => {
        if (lokaltMånedsbeløp !== omregnetÅrsinntektMånedsbeløpRounded) {
            onEndre(true);
        }
    }, [omregnetÅrsinntektMånedsbeløpRounded]);

    useEffect(() => {
        if (!stringIsNaN(values.manedsbelop)) {
            onEndre(Number.parseFloat(values.manedsbelop) !== omregnetÅrsinntektMånedsbeløpRounded);
        }
    }, [values, omregnetÅrsinntektMånedsbeløpRounded]);

    useEffect(() => {
        harFeil && feiloppsummeringRef.current?.focus();
    }, [harFeil]);

    const confirmChanges = () => {
        const { manedsbelop, forklaring } = form.getValues();

        if (stringIsNaN(manedsbelop)) return;

        const overstyrtInntektOgRefusjon: OverstyrtInntektOgRefusjonDTO = {
            fødselsnummer: person.fodselsnummer,
            aktørId: person.aktorId,
            skjæringstidspunkt: periode.skjaeringstidspunkt,
            arbeidsgivere: [
                {
                    organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                    begrunnelse: 'tilkommen',
                    forklaring: forklaring,
                    månedligInntekt: Number.parseFloat(manedsbelop),
                    fraMånedligInntekt: periode.manedligBelop ?? 0,
                    refusjonsopplysninger: [],
                    fraRefusjonsopplysninger: [],
                    fom: periode.fom,
                    tom: periode.tom,
                },
            ],
            vedtaksperiodeId: finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt(person.arbeidsgivere, periode),
        };

        setOverstyring(overstyrtInntektOgRefusjon, arbeidsgiver.organisasjonsnummer);
        cancelEditing();
    };

    const visFeilOppsummering =
        !form.formState.isValid && form.formState.isSubmitted && Object.entries(form.formState.errors).length > 0;

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <div className={styles.EditableInntekt}>
                    <Månedsbeløp
                        månedsbeløp={periode.manedligBelop}
                        kilde={''}
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
                        <Button size="small" variant="secondary" type="submit">
                            Lagre
                        </Button>
                        <Button size="small" variant="tertiary" type="button" onClick={cancelEditing}>
                            Avbryt
                        </Button>
                    </span>
                    {showSlettLokaleOverstyringerModal && (
                        <SlettLokaleOverstyringerModal
                            showModal={showSlettLokaleOverstyringerModal}
                            onApprove={() => {
                                form.handleSubmit(confirmChanges);
                                setShowSlettLokaleOverstyringerModal(false);
                            }}
                            onClose={() => setShowSlettLokaleOverstyringerModal(false)}
                            overstyrtSkjæringstidspunkt={lokaleInntektoverstyringer.skjæringstidspunkt}
                            skjæringstidspunkt={periode.skjaeringstidspunkt}
                        />
                    )}
                </div>
            </form>
        </FormProvider>
    );
};
