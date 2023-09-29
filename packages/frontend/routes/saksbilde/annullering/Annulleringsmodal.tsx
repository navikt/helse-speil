import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';

import { Alert, BodyShort, Button, Loader } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { Modal } from '@components/Modal';
import { AnnullerDocument, AnnulleringDataInput, Utbetalingslinje } from '@io/graphql';
import { postAbonnerPåAktør } from '@io/http';
import { opptegnelsePollingTimeState } from '@state/opptegnelser';
import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';

import { Annulleringsbegrunnelse } from './Annulleringsbegrunnelse';

import styles from './Annulleringsmodal.module.css';

const ModalContainer = styled(Modal)`
    max-width: 48rem;

    .skjemaelement__feilmelding {
        font-style: normal;
    }
`;

const Form = styled.form`
    padding: 0.5rem 2.5rem 2.5rem;
`;

const Tittel = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--a-text-default);
    margin-bottom: 2rem;
`;

const AnnullerKnapp = styled(Button)`
    margin-right: 1rem;

    > svg {
        margin-left: 0.5rem;
    }
`;

const Feilmelding = styled(BodyShort)`
    color: var(--a-text-danger);
    font-size: 1rem;
    font-weight: 600;
    margin-top: 0.625rem;
`;

const Varseltekst = styled(Feilmelding)`
    margin-bottom: 1.225rem;
`;

const Utbetalingsgruppe = styled.div`
    margin-bottom: 2rem;

    > p,
    > ul > li {
        margin-bottom: 0.5rem;
    }
`;

interface AnnulleringsmodalProps {
    fødselsnummer: string;
    aktørId: string;
    organisasjonsnummer: string;
    fagsystemId: string;
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
    linjer,
    onClose,
    onSuccess,
    varseltekst,
}: AnnulleringsmodalProps) => {
    const [isSending, setIsSending] = useState<boolean>(false);
    const [postAnnulleringFeil, setPostAnnulleringFeil] = useState<string>();
    const setOpptegnelsePollingTime = useSetRecoilState(opptegnelsePollingTimeState);
    const [annullerMutation] = useMutation(AnnullerDocument);

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
            setIsSending(true);
            setPostAnnulleringFeil(undefined);
            annullerMutation({ variables: { annullering } })
                .then(() => {
                    postAbonnerPåAktør(annullering.aktorId).then(() => {
                        setOpptegnelsePollingTime(1000);
                    });
                    onSuccess && onSuccess();
                    onClose();
                })
                .catch(() => setPostAnnulleringFeil('Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.'))
                .finally(() => setIsSending(false));
        }
        setTimeout(() => {
            if (!harFeil()) startSubmit();
        }, 0);
    };

    return (
        <FormProvider {...form}>
            <ModalContainer
                className="AnnulleringModal"
                isOpen={true}
                contentLabel="Feilmelding"
                onRequestClose={onClose}
            >
                <Form onSubmit={form.handleSubmit(() => sendAnnullering(annullering()))}>
                    <Alert inline variant="warning" className={styles.Warning}>
                        Hvis du annullerer vil utbetalinger fjernes fra oppdragssystemet og du må behandle saken i
                        Infotrygd.
                    </Alert>
                    <Tittel>Annullering</Tittel>
                    <Utbetalingsgruppe>
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
                    </Utbetalingsgruppe>
                    <Annulleringsbegrunnelse />
                    {varseltekst && <Varseltekst as="p">{varseltekst}</Varseltekst>}
                    <AnnullerKnapp as="button" variant="secondary" disabled={isSending}>
                        Annuller
                        {isSending && <Loader size="xsmall" />}
                    </AnnullerKnapp>
                    <Button variant="tertiary" onClick={onClose}>
                        Avbryt
                    </Button>
                    {postAnnulleringFeil && <Feilmelding as="p">{postAnnulleringFeil}</Feilmelding>}
                </Form>
            </ModalContainer>
        </FormProvider>
    );
};
