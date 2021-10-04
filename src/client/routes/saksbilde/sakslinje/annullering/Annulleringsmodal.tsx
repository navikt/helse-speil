import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';

import { BodyShort, Button, Loader } from '@navikt/ds-react';

import { Modal } from '../../../../components/Modal';
import { postAbonnerPåAktør, postAnnullering } from '../../../../io/http';
import { AnnulleringDTO } from '../../../../io/types';
import { opptegnelsePollingTimeState } from '../../../../state/opptegnelser';
import { NORSK_DATOFORMAT } from '../../../../utils/date';
import { somPenger } from '../../../../utils/locale';

import { Annulleringsbegrunnelse } from './Annulleringsbegrunnelse';
import { Annulleringsvarsel } from './Annulleringsvarsel';

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
    color: var(--navds-color-text-primary);
    margin-bottom: 2rem;
`;

const AnnullerKnapp = styled(Button)`
    margin-right: 1rem;

    > svg {
        margin-left: 0.5rem;
    }
`;

const Feilmelding = styled(BodyShort)`
    color: var(--navds-color-text-error);
    font-size: 1rem;
    font-weight: 600;
    margin-top: 0.625rem;
`;

const Utbetalingsgruppe = styled.div`
    margin-bottom: 2rem;
`;

export interface Annulleringslinje {
    fom: Dayjs;
    tom: Dayjs;
    dagsats?: number;
}

interface AnnulleringsmodalProps {
    person: Person;
    organisasjonsnummer: string;
    fagsystemId: string;
    linjer: Annulleringslinje[];
    onClose: () => void;
    onSuccess?: () => void;
}

export const Annulleringsmodal = ({
    person,
    organisasjonsnummer,
    fagsystemId,
    linjer,
    onClose,
    onSuccess,
}: AnnulleringsmodalProps) => {
    const [isSending, setIsSending] = useState<boolean>(false);
    const [postAnnulleringFeil, setPostAnnulleringFeil] = useState<string>();
    const setOpptegnelsePollingTime = useSetRecoilState(opptegnelsePollingTimeState);

    const form = useForm({ mode: 'onBlur' });
    const kommentar = form.watch('kommentar');
    const begrunnelser = form.watch(`begrunnelser`);
    const gjelderSisteSkjæringstidspunkt = form.watch(`gjelder_siste_skjæringstidspunkt`);
    const annenBegrunnelse = begrunnelser ? begrunnelser.includes('annet') : false;
    const harMinstÉnBegrunnelse = () => begrunnelser?.length > 0 ?? true;
    const harFeil = () => Object.keys(form.formState.errors).length > 0;

    const annullering = (): AnnulleringDTO => ({
        aktørId: person.aktørId,
        fødselsnummer: person.fødselsnummer,
        organisasjonsnummer: organisasjonsnummer,
        fagsystemId: fagsystemId,
        begrunnelser: begrunnelser,
        gjelder_siste_skjæringstidspunkt: gjelderSisteSkjæringstidspunkt === 'siste_skjæringstidspunkt',
        kommentar: kommentar ? (kommentar.trim() === '' ? undefined : kommentar.trim()) : undefined,
    });

    const sendAnnullering = (annullering: AnnulleringDTO) => {
        if (!gjelderSisteSkjæringstidspunkt) {
            form.setError('gjelder_siste_skjæringstidspunkt', {
                type: 'manual',
                message: 'Velg om endringen gjelder siste skjæringstidspunkt eller et tidligere skjæringstidspunkt',
            });
        }
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

        if (!harFeil()) {
            setIsSending(true);
            setPostAnnulleringFeil(undefined);
            postAnnullering(annullering)
                .then(() => {
                    postAbonnerPåAktør(annullering.aktørId).then(() => {
                        setOpptegnelsePollingTime(1000);
                    });
                    onSuccess && onSuccess();
                    onClose();
                })
                .catch(() => setPostAnnulleringFeil('Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.'))
                .finally(() => setIsSending(false));
        }
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
                    <Annulleringsvarsel variant="warning">
                        Hvis du annullerer, vil utbetalinger fjernes fra oppdragssystemet og du må behandle saken i
                        Infotrygd.
                    </Annulleringsvarsel>
                    <Tittel>Annullering</Tittel>
                    <Utbetalingsgruppe>
                        <BodyShort>Følgende utbetalinger annulleres:</BodyShort>
                        <ul>
                            {linjer.map((linje, index) => (
                                <li key={index}>
                                    {linje.fom.format(NORSK_DATOFORMAT)} - {linje.tom.format(NORSK_DATOFORMAT)}
                                    {linje.dagsats && ' - ' + somPenger(linje.dagsats)}
                                </li>
                            ))}
                        </ul>
                    </Utbetalingsgruppe>
                    <Annulleringsbegrunnelse />
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
