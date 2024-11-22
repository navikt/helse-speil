import React, { ReactElement, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Alert, BodyShort, Button, Heading, Modal } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { Arsak } from '@external/sanity';
import { useActivePeriodHasLatestSkjæringstidspunkt } from '@hooks/revurdering';
import { AmplitudeContext } from '@io/amplitude';
import { AnnullerDocument, AnnulleringDataInput, OpprettAbonnementDocument, PersonFragment } from '@io/graphql';
import { useSetOpptegnelserPollingRate } from '@state/opptegnelser';

import { Annulleringsbegrunnelse } from './Annulleringsbegrunnelse';
import { Annulleringsinformasjon } from './Annulleringsinformasjon';

import styles from './Annulleringsmodal.module.scss';

type AnnulleringsModalProps = {
    onClose: () => void;
    showModal: boolean;
    organisasjonsnummer: string;
    vedtaksperiodeId: string;
    utbetalingId: string;
    arbeidsgiverFagsystemId: string;
    personFagsystemId: string;
    person: PersonFragment;
};

export const AnnulleringsModal = ({
    onClose,
    showModal,
    organisasjonsnummer,
    vedtaksperiodeId,
    utbetalingId,
    arbeidsgiverFagsystemId,
    personFagsystemId,
    person,
}: AnnulleringsModalProps): ReactElement => {
    const setOpptegnelsePollingTime = useSetOpptegnelserPollingRate();
    const [annullerMutation, { error, loading }] = useMutation(AnnullerDocument);
    const [opprettAbonnement] = useMutation(OpprettAbonnementDocument);
    const amplitude = useContext(AmplitudeContext);
    const erINyesteSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt(person);

    const form = useForm({ mode: 'onBlur' });
    const kommentar = form.watch('kommentar');
    const arsaker: Arsak[] = ((form.watch('begrunnelser') as string[]) || [])?.map((begrunnelse: string) =>
        JSON.parse(begrunnelse),
    );
    const begrunnelser: string[] = arsaker?.map((årsak) => årsak.arsak);
    const annenBegrunnelse = arsaker ? arsaker.some((it) => it.arsak === 'Annet') : false;

    const harMinstÉnBegrunnelse = () => arsaker?.length > 0;
    const harFeil = () => Object.keys(form.formState.errors).length > 0;

    const annullering = (): AnnulleringDataInput => ({
        aktorId: person?.aktorId,
        fodselsnummer: person?.fodselsnummer,
        organisasjonsnummer,
        vedtaksperiodeId,
        utbetalingId,
        arbeidsgiverFagsystemId,
        personFagsystemId,
        begrunnelser,
        arsaker,
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
            aria-label="Annulleringsmodal"
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
                        <Annulleringsinformasjon person={person} />
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
