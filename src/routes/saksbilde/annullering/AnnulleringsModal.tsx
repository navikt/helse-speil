import React, { ReactElement, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Alert, BodyShort, Button, Heading, Modal } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { Arsak } from '@external/sanity';
import { useActivePeriodHasLatestSkjæringstidspunkt } from '@hooks/revurdering';
import { AmplitudeContext } from '@io/amplitude';
import { AnnullerDocument, AnnulleringDataInput, BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useAddToast } from '@state/toasts';

import { Annulleringsbegrunnelse } from './Annulleringsbegrunnelse';
import { Annulleringsinformasjon } from './Annulleringsinformasjon';

import styles from './Annulleringsmodal.module.scss';

type AnnulleringsModalProps = {
    closeModal: () => void;
    showModal: boolean;
    organisasjonsnummer: string;
    vedtaksperiodeId: string;
    utbetalingId: string;
    arbeidsgiverFagsystemId: string;
    personFagsystemId: string;
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
};

export const AnnulleringsModal = ({
    closeModal,
    showModal,
    organisasjonsnummer,
    vedtaksperiodeId,
    utbetalingId,
    arbeidsgiverFagsystemId,
    personFagsystemId,
    person,
    periode,
}: AnnulleringsModalProps): ReactElement => {
    const setOpptegnelsePollingTime = useSetOpptegnelserPollingRate();
    const [annullerMutation, { error, loading }] = useMutation(AnnullerDocument);
    const amplitude = useContext(AmplitudeContext);
    const erINyesteSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt(person);
    const addToast = useAddToast();

    const form = useForm({ mode: 'onBlur', defaultValues: { kommentar: '', arsaker: [] as string[] } });
    const kommentar = form.watch('kommentar').trim();
    const arsaker: Arsak[] = form.watch('arsaker').map((årsak: string) => JSON.parse(årsak));

    const harValgtAnnet = arsaker.some((it) => it.arsak === 'Annet');

    const harMinstÉnÅrsak = () => arsaker.length > 0;
    const harFeil = () => Object.keys(form.formState.errors).length > 0;

    const annullering = (): AnnulleringDataInput => ({
        aktorId: person?.aktorId,
        fodselsnummer: person?.fodselsnummer,
        organisasjonsnummer,
        vedtaksperiodeId,
        utbetalingId,
        arbeidsgiverFagsystemId,
        personFagsystemId,
        arsaker,
        kommentar: kommentar == '' ? undefined : kommentar,
    });

    const sendAnnullering = (annullering: AnnulleringDataInput) => {
        if (harValgtAnnet && !kommentar) {
            form.setError('kommentar', {
                type: 'manual',
                message: 'Skriv en kommentar hvis du velger årsaken "annet"',
            });
        }
        if (!harMinstÉnÅrsak()) {
            form.setError('arsaker', {
                type: 'manual',
                message: 'Velg minst én årsak',
            });
        }

        function startSubmit() {
            void annullerMutation({
                variables: { annullering },
                onCompleted: () => {
                    amplitude.logAnnullert(annullering.arsaker.map((årsak) => årsak.arsak));
                    setOpptegnelsePollingTime(1000);
                    addToast({
                        message: 'Annulleringen er sendt',
                        timeToLiveMs: 5000,
                        key: utbetalingId,
                    });
                    closeModal();
                },
            });
        }

        setTimeout(() => {
            if (!harFeil()) startSubmit();
        }, 0);
    };

    return (
        <Modal
            aria-label="Annulleringsmodal"
            portal
            closeOnBackdropClick
            open={showModal}
            onClose={closeModal}
            width="850px"
        >
            <Modal.Header>
                <Alert inline variant="warning" className={styles.warning}>
                    Hvis du annullerer vil utbetalinger fjernes fra oppdragssystemet og du må behandle saken i
                    Infotrygd.
                </Alert>
                <Heading level="1" size="medium">
                    Annullering
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <FormProvider {...form}>
                    <form
                        className={styles.form}
                        onSubmit={form.handleSubmit(() => sendAnnullering(annullering()))}
                        id="annullerings-modal-form"
                    >
                        <Annulleringsinformasjon person={person} periode={periode} />
                        <Annulleringsbegrunnelse />
                        {!erINyesteSkjæringstidspunkt && (
                            <BodyShort className={styles.varseltekst}>
                                Utbetalinger må annulleres kronologisk, nyeste først. Du kan forsøke å annullere denne,
                                men om den ikke er den nyeste vil den ikke bli annullert.
                            </BodyShort>
                        )}
                    </form>
                </FormProvider>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" form="annullerings-modal-form" loading={loading}>
                    Annuller
                </Button>
                <Button variant="tertiary" type="button" onClick={closeModal}>
                    Avbryt
                </Button>
                {error && (
                    <BodyShort className={styles.feilmelding}>
                        Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.
                    </BodyShort>
                )}
            </Modal.Footer>
        </Modal>
    );
};
