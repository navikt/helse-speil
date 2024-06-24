import React, { ReactElement, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Alert, BodyShort, Button, Heading, Loader, Modal } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { useActivePeriodHasLatestSkjæringstidspunkt } from '@hooks/revurdering';
import { AmplitudeContext } from '@io/amplitude';
import { AnnullerDocument, AnnulleringDataInput, OpprettAbonnementDocument } from '@io/graphql';
import { useSetOpptegnelserPollingRate } from '@state/opptegnelser';

import { Annulleringsbegrunnelse } from './Annulleringsbegrunnelse';
import { Annulleringsinformasjon } from './Annulleringsinformasjon';

import styles from './Annulleringsmodal.module.scss';

type AnnulleringsModalProps = {
    onClose: () => void;
    showModal: boolean;
    fødselsnummer: string;
    aktørId: string;
    organisasjonsnummer: string;
    vedtaksperiodeId: string;
    utbetalingId: string;
};

export const AnnulleringsModal = ({
    onClose,
    showModal,
    fødselsnummer,
    aktørId,
    organisasjonsnummer,
    vedtaksperiodeId,
    utbetalingId,
}: AnnulleringsModalProps): ReactElement => {
    const setOpptegnelsePollingTime = useSetOpptegnelserPollingRate();
    const [annullerMutation, { error, loading }] = useMutation(AnnullerDocument);
    const [opprettAbonnement] = useMutation(OpprettAbonnementDocument);
    const amplitude = useContext(AmplitudeContext);
    const erINyesteSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt();

    const form = useForm({ mode: 'onBlur' });
    const kommentar = form.watch('kommentar');
    const begrunnelser = form.watch(`begrunnelser`);
    const annenBegrunnelse = begrunnelser ? begrunnelser.includes('annet') : false;

    const harMinstÉnBegrunnelse = () => begrunnelser?.length > 0 ?? true;
    const harFeil = () => Object.keys(form.formState.errors).length > 0;

    const annullering = (): AnnulleringDataInput => ({
        aktorId: aktørId,
        fodselsnummer: fødselsnummer,
        organisasjonsnummer,
        vedtaksperiodeId,
        utbetalingId,
        begrunnelser,
        kommentar: kommentar ? (kommentar.trim() === '' ? undefined : kommentar.trim()) : undefined,
    });

    const sendAnnullering = (annullering: AnnulleringDataInput) => {
        if (annenBegrunnelse && !kommentar) {
            form.setError('kommentar', {
                type: 'manual',
                message: 'Skriv en kommentar hvis du velger begrunnelsen "annet"',
            });
        }
        if (!harMinstÉnBegrunnelse()) {
            form.setError('begrunnelser', {
                type: 'manual',
                message: 'Velg minst én begrunnelse',
            });
        }

        function startSubmit() {
            void annullerMutation({
                variables: { annullering },
                onCompleted: () => {
                    amplitude.logAnnullert(annullering.begrunnelser);
                    void opprettAbonnement({
                        variables: { personidentifikator: annullering.aktorId },
                        onCompleted: () => setOpptegnelsePollingTime(1000),
                    });
                    onClose();
                },
            });
        }

        setTimeout(() => {
            if (!harFeil()) startSubmit();
        }, 0);
    };

    return (
        <Modal
            aria-label="Legg på vent modal"
            portal
            closeOnBackdropClick
            open={showModal}
            onClose={onClose}
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
                        <Annulleringsinformasjon />
                        <Annulleringsbegrunnelse />
                        {!erINyesteSkjæringstidspunkt && (
                            <BodyShort as="p" className={styles.varseltekst}>
                                Utbetalinger må annulleres kronologisk, nyeste først. Du kan forsøke å annullere denne,
                                men om den ikke er den nyeste vil den ikke bli annullert.
                            </BodyShort>
                        )}
                    </form>
                </FormProvider>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" form="annullerings-modal-form" disabled={loading}>
                    Annuller
                    {loading && <Loader size="xsmall" />}
                </Button>
                <Button variant="tertiary" type="button" onClick={onClose}>
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
