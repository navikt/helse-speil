import { Person } from 'internal-types';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import styled from '@emotion/styled';
import { Feilmelding, Normaltekst } from 'nav-frontend-typografi';
import { Modal } from './Modal';
import { PersonoppdateringDTO } from '../io/types';
import { postForespørPersonoppdatering } from '../io/http';
import { useHistory } from 'react-router';

const Form = styled.form`
    padding: 0.5rem 2.5rem 2.5rem;
`;

const Tittel = styled.h1`
    font-size: 1.5rem;
    font-weight: 600;
    color: #3e3832;
    margin-bottom: 1.5rem;
`;

const ModalContainer = styled(Modal)`
    max-width: 32rem;

    .skjemaelement__feilmelding {
        font-style: normal;
    }
`;

const OppdaterTekst = styled(Normaltekst)`
    margin-bottom: 1.5rem;
`;

interface Props {
    person: Person;
    onClose: () => void;
}

export const PersonoppdateringModal = ({ person, onClose }: Props) => {
    const history = useHistory();
    const form = useForm({ mode: 'onBlur' });
    const [isSending, setIsSending] = useState<boolean>(false);
    const [forespørPersonoppdateringFeil, setForespørPersonoppdateringFeil] = useState<string>();

    const oppdaterPerson = (): PersonoppdateringDTO => ({
        fødselsnummer: person.fødselsnummer,
    });

    const forespørPersonoppdatering = (oppdatering: PersonoppdateringDTO) => {
        setIsSending(true);
        setForespørPersonoppdateringFeil(undefined);
        postForespørPersonoppdatering(oppdatering)
            .then(() => {
                setIsSending(false);
                onClose();
                history.push('/');
            })
            .catch(() => {
                setForespørPersonoppdateringFeil('Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.');
                setIsSending(false);
            });
    };

    const submit = () => {
        forespørPersonoppdatering(oppdaterPerson());
    };

    return (
        <FormProvider {...form}>
            <ModalContainer contentLabel="Feilmelding" isOpen={true} onRequestClose={onClose}>
                <Form onSubmit={form.handleSubmit(submit)}>
                    <Tittel>Oppdater persondata</Tittel>
                    <OppdaterTekst>
                        Dette vil oppdatere innholdet for denne personen. Dette kan ta litt tid. Siden må oppdateres
                        etter en stund.
                    </OppdaterTekst>
                    <Knapp spinner={isSending} autoDisableVedSpinner>
                        Oppdater
                    </Knapp>
                    <Flatknapp onClick={onClose}>Avbryt</Flatknapp>
                    {forespørPersonoppdateringFeil && <Feilmelding>{forespørPersonoppdateringFeil}</Feilmelding>}
                </Form>
            </ModalContainer>
        </FormProvider>
    );
};
