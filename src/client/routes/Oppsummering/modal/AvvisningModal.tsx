import React from 'react';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import styled from '@emotion/styled';

Modal.setAppElement('#root');

interface Props {
    isSending: boolean;
    onApprove: () => void;
    onClose: () => void;
}

const StyledModal = styled(Modal)`
    max-width: 29rem;
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

const AvvinsningModal = ({ isSending, onApprove, onClose }: Props) => (
    <StyledModal id="modal" isOpen={true} contentLabel="Avvis utbetaling" closeButton={true} onRequestClose={onClose}>
        <Tittel>Er du sikker?</Tittel>
        <Normaltekst>Når du trykker ja blir saken sendt til infotrygd.</Normaltekst>
        <div>
            <OkKnapp spinner={isSending} onClick={onApprove}>
                Ja
            </OkKnapp>
            <AvbrytKnapp onClick={onClose}>Avbryt</AvbrytKnapp>
        </div>
    </StyledModal>
);

export default AvvinsningModal;
