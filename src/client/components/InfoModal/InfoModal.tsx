import React from 'react';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import './InfoModal.less';

Modal.setAppElement('#root');

interface Props {
    infoMessage: string;
    isSending: boolean;
    onApprove: () => void;
    onClose: () => void;
}

const InfoModal = ({ infoMessage, isSending, onApprove, onClose }: Props) => (
    <Modal
        id="modal"
        className="InfoModal"
        isOpen={true}
        contentLabel="Feilmelding"
        closeButton={true}
        onRequestClose={onClose}
    >
        <Systemtittel>Er du sikker?</Systemtittel>
        <Normaltekst>{infoMessage}</Normaltekst>
        <div>
            <Hovedknapp spinner={isSending} onClick={onApprove}>
                Ja
            </Hovedknapp>
            <Knapp onClick={onClose}>Avbryt</Knapp>
        </div>
    </Modal>
);

export default InfoModal;
