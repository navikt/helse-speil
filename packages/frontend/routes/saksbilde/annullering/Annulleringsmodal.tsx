import styles from './Annulleringsmodal.module.scss';
import React, { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Alert, BodyShort, Button, Loader } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { Modal } from '@components/Modal';
import { useActivePeriodHasLatestSkjæringstidspunkt } from '@hooks/revurdering';
import { AmplitudeContext } from '@io/amplitude';
import { AnnullerDocument, AnnulleringDataInput, OpprettAbonnementDocument } from '@io/graphql';
import { useSetOpptegnelserPollingRate } from '@state/opptegnelser';

import { Annulleringsbegrunnelse } from './Annulleringsbegrunnelse';
import { Annulleringsinformasjon } from './Annulleringsinformasjon';

interface AnnulleringsmodalProps {
    fødselsnummer: string;
    aktørId: string;
    organisasjonsnummer: string;
    fagsystemId: string;
    utbetalingId: Maybe<string>;
    onClose: () => void;
    onSuccess?: () => void;
}

export const Annulleringsmodal = ({
    fødselsnummer,
    aktørId,
    organisasjonsnummer,
    fagsystemId,
    utbetalingId,
    onClose,
    onSuccess,
}: AnnulleringsmodalProps) => {
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
        fagsystemId,
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
                    amplitude.logAnnullert(false, annullering.begrunnelser);
                    void opprettAbonnement({
                        variables: { personidentifikator: annullering.aktorId },
                        onCompleted: () => setOpptegnelsePollingTime(1000),
                    });
                    onSuccess && onSuccess();
                    onClose();
                },
            });
        }

        setTimeout(() => {
            if (!harFeil()) startSubmit();
        }, 0);
    };

    return (
        <FormProvider {...form}>
            <Modal className={styles.modal} isOpen={true} contentLabel="Feilmelding" onRequestClose={onClose}>
                <form className={styles.form} onSubmit={form.handleSubmit(() => sendAnnullering(annullering()))}>
                    <Alert inline variant="warning" className={styles.warning}>
                        Hvis du annullerer vil utbetalinger fjernes fra oppdragssystemet og du må behandle saken i
                        Infotrygd.
                    </Alert>
                    <h2 className={styles.tittel}>Annullering</h2>
                    <Annulleringsinformasjon />
                    <Annulleringsbegrunnelse />
                    {!erINyesteSkjæringstidspunkt && (
                        <BodyShort as="p" className={styles.varseltekst}>
                            Utbetalinger må annulleres kronologisk, nyeste først. Du kan forsøke å annullere denne, men
                            om den ikke er den nyeste vil den ikke bli annullert.
                        </BodyShort>
                    )}
                    <Button className={styles.annullerknapp} as="button" variant="secondary" disabled={loading}>
                        Annuller
                        {loading && <Loader size="xsmall" />}
                    </Button>
                    <Button variant="tertiary" onClick={onClose}>
                        Avbryt
                    </Button>
                    {error && (
                        <BodyShort as="p" className={styles.feilmelding}>
                            Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.
                        </BodyShort>
                    )}
                </form>
            </Modal>
        </FormProvider>
    );
};
