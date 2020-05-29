import React from 'react';
import Modal from 'nav-frontend-modal';
import { Systemtittel } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import styled from '@emotion/styled';
import { Avvisningverdier, useSkjemaState } from './useSkjemaState';
import { Begrunnelsesskjema } from './Begrunnelsesskjema';

Modal.setAppElement('#root');

interface Props {
    isSending: boolean;
    onApprove: (skjema: Avvisningverdier) => void;
    onClose: () => void;
}

const StyledModal = styled(Modal)`
    max-width: 50rem;
    section {
        display: flex;
        flex-direction: column;
        min-width: 24rem;
        padding: 1rem;
    }
`;

const Tittel = styled(Systemtittel)`
    margin-bottom: 1rem;
`;

const OkKnapp = styled(Hovedknapp)`
    margin-top: 2rem;
    width: max-content;
    margin-right: 1rem;
`;

const AvbrytKnapp = styled(Knapp)`
    margin-top: 2rem;
    width: max-content;
`;

const AvvinsningModal = ({ isSending, onApprove, onClose }: Props) => {
    const {
        clear,
        verdier,
        årsak,
        begrunnelse,
        kommentar,
        leggTilBegrunnelse,
        fjernBegrunnelse,
        setValgtÅrsak,
        setKommentar,
        årsakHarFeil,
        begrunnelseHarFeil,
        kommentarfeiltHarFeil,
        setFeil,
    } = useSkjemaState();

    const submit = () => {
        if (årsakHarFeil() || begrunnelseHarFeil() || kommentarfeiltHarFeil()) {
            setFeil();
        } else {
            onApprove(verdier);
        }
    };

    const closeModal = () => {
        clear();
        onClose();
    };

    return (
        <StyledModal
            id="modal"
            isOpen={true}
            contentLabel="Avvis utbetaling"
            closeButton={true}
            onRequestClose={onClose}
        >
            <Tittel>Ikke utbetal</Tittel>
            <Begrunnelsesskjema
                skjemaÅrsak={årsak}
                skjemaBegrunnelser={begrunnelse}
                skjemaKommentar={kommentar}
                leggTilBegrunnelse={leggTilBegrunnelse}
                fjernBegrunnelse={fjernBegrunnelse}
                setValgtÅrsak={setValgtÅrsak}
                setKommentar={setKommentar}
            />
            <div>
                <OkKnapp spinner={isSending} onClick={() => submit()}>
                    Avslutt saken
                </OkKnapp>
                <AvbrytKnapp onClick={closeModal}>Avbryt</AvbrytKnapp>
            </div>
        </StyledModal>
    );
};

export default AvvinsningModal;
