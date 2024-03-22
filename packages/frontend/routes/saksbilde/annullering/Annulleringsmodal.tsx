import styles from './Annulleringsmodal.module.scss';
import dayjs from 'dayjs';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Alert, BodyShort, Button, Loader } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { Modal } from '@components/Modal';
import { AnnullerDocument, AnnulleringDataInput, OpprettAbonnementDocument, Utbetalingslinje } from '@io/graphql';
import { useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';

import { Annulleringsbegrunnelse } from './Annulleringsbegrunnelse';

interface AnnulleringsmodalProps {
    fødselsnummer: string;
    aktørId: string;
    organisasjonsnummer: string;
    fagsystemId: string;
    utbetalingId: Maybe<string>;
    linjer: Array<Utbetalingslinje>;
    onClose: () => void;
    onSuccess?: () => void;
    varseltekst?: string;
}

export const Annulleringsmodal = ({
    fødselsnummer,
    aktørId,
    organisasjonsnummer,
    fagsystemId,
    utbetalingId,
    linjer,
    onClose,
    onSuccess,
    varseltekst,
}: AnnulleringsmodalProps) => {
    const setOpptegnelsePollingTime = useSetOpptegnelserPollingRate();
    const [annullerMutation, { error, loading }] = useMutation(AnnullerDocument);
    const [opprettAbonnement] = useMutation(OpprettAbonnementDocument);

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
                    <div className={styles.gruppe}>
                        <BodyShort>Følgende utbetalinger annulleres:</BodyShort>
                        <ul>
                            {linjer.map((linje, index) => (
                                <li key={index}>
                                    <BodyShort>
                                        {dayjs(linje.fom).format(NORSK_DATOFORMAT)} -{' '}
                                        {dayjs(linje.tom).format(NORSK_DATOFORMAT)}
                                        {linje.totalbelop ? ` - ${somPenger(linje.totalbelop)}` : null}
                                    </BodyShort>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Annulleringsbegrunnelse />
                    {varseltekst && (
                        <BodyShort as="p" className={styles.varseltekst}>
                            {varseltekst}
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
