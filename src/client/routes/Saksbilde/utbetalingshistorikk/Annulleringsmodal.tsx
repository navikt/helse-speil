import styled from '@emotion/styled';
import { Modal } from '../../../components/Modal';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { Feilmelding as NavFeilmelding, Normaltekst } from 'nav-frontend-typografi';
import { Person, UtbetalingshistorikkUtbetaling } from 'internal-types';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AnnulleringDTO } from '../../../io/types';
import { postAnnullering } from '../../../io/http';
import { Annulleringsvarsel } from '../sakslinje/annullering/Annulleringsvarsel';
import { findEarliest, findLatest, NORSK_DATOFORMAT } from '../../../utils/date';

const ModalContainer = styled(Modal)`
    max-width: 48rem;

    .skjemaelement__feilmelding {
        font-style: normal;
    }
`;

const Form = styled.form`
    padding: 0.5rem 2.5rem 2.5rem;
`;

const Tittel = styled.h1`
    font-size: 1.5rem;
    font-weight: 600;
    color: #3e3832;
    margin-bottom: 1.5rem;
`;

const AnnullerKnapp = styled(Knapp)`
    margin-right: 1rem;
`;

const Feilmelding = styled(NavFeilmelding)`
    margin-top: 0.625rem;
`;

const TilAnnullering = styled.div`
    margin: 1.5rem 0 0 2rem;
`;

const Utbetalingsgruppe = styled.div`
    margin-bottom: 2rem;
`;

interface Props {
    person: Person;
    utbetaling: UtbetalingshistorikkUtbetaling;
    onClose: () => void;
    onSuccess: () => void;
}

export const Annulleringsmodal = ({ person, utbetaling, onClose, onSuccess }: Props) => {
    const [isSending, setIsSending] = useState<boolean>(false);
    const [postAnnulleringFeil, setPostAnnulleringFeil] = useState<string>();

    const form = useForm({ mode: 'onBlur' });

    const annullering = (): AnnulleringDTO => ({
        aktørId: person.aktørId,
        fødselsnummer: person.fødselsnummer,
        organisasjonsnummer: utbetaling.arbeidsgiverOppdrag.orgnummer,
        fagsystemId: utbetaling.arbeidsgiverOppdrag.fagsystemId,
    });

    const sendAnnullering = (annullering: AnnulleringDTO) => {
        setIsSending(true);
        setPostAnnulleringFeil(undefined);
        postAnnullering(annullering)
            .then(() => {
                onSuccess();
                onClose();
            })
            .catch(() => setPostAnnulleringFeil('Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.'))
            .finally(() => setIsSending(false));
    };

    const submit = () => sendAnnullering(annullering());
    const tidligsteFom = findEarliest(utbetaling.arbeidsgiverOppdrag.utbetalingslinjer.map((l) => l.fom));
    const sisteTom = findLatest(utbetaling.arbeidsgiverOppdrag.utbetalingslinjer.map((l) => l.tom));

    return (
        <FormProvider {...form}>
            <ModalContainer
                className="AnnulleringModal"
                isOpen={true}
                contentLabel="Feilmelding"
                onRequestClose={onClose}
            >
                <Form onSubmit={form.handleSubmit(submit)}>
                    <Annulleringsvarsel />
                    <Tittel>Annullering</Tittel>
                    <Utbetalingsgruppe>
                        <TilAnnullering>
                            <Normaltekst>Følgende utbetaling annulleres:</Normaltekst>
                            <Normaltekst>
                                {tidligsteFom.format(NORSK_DATOFORMAT)} - {sisteTom.format(NORSK_DATOFORMAT)}
                            </Normaltekst>
                        </TilAnnullering>
                    </Utbetalingsgruppe>
                    <AnnullerKnapp spinner={isSending} autoDisableVedSpinner>
                        Annullér
                    </AnnullerKnapp>
                    <Flatknapp onClick={onClose}>Avbryt</Flatknapp>
                    {postAnnulleringFeil && <Feilmelding>{postAnnulleringFeil}</Feilmelding>}
                </Form>
            </ModalContainer>
        </FormProvider>
    );
};
