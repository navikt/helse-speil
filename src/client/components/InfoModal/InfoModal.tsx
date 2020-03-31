import React from 'react';
import Modal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
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
    <Modal className="InfoModal" isOpen={true} contentLabel="Feilmelding" closeButton={true} onRequestClose={onClose}>
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

InfoModal.propTypes = {
    infoMessage: PropTypes.string.isRequired,
    isSending: PropTypes.bool.isRequired,
    onApprove: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default InfoModal;
