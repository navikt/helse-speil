import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Alert, BodyShort, Button, HStack, VStack } from '@navikt/ds-react';

import { Feiloppsummering } from '@components/Feiloppsummering';
import { ForklaringTextarea } from '@components/ForklaringTextarea';
import { ArbeidsgiverFragment, Maybe, NyttInntektsforholdPeriodeFragment, PersonFragment } from '@io/graphql';
import {
    formErrorsTilFeilliste,
    stringIsNaN,
} from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/InntektOgRefusjonSkjema';
import styles from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/InntektOgRefusjonSkjema.module.css';
import { SlettLokaleOverstyringerModal } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/SlettLokaleOverstyringerModal';
import { MånedsbeløpInput } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/månedsbeløp/MånedsbeløpInput';
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
                <VStack gap="4">
                    <HStack align="center" gap="6">
                        <BodyShort>Inntekt per måned</BodyShort>
                        <MånedsbeløpInput
                            initialMånedsbeløp={periode.manedligBelop}
                            skalDeaktiveres={false}
                            lokaltMånedsbeløp={lokaltMånedsbeløp}
                        />
                    </HStack>
                    <ForklaringTextarea
                        description={`Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn.`}
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
                </VStack>
            </form>
        </FormProvider>
    );
};
