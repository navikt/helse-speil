import React from 'react';
import Modal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import './InfoModal.less';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

Modal.setAppElement('#root');

const InfoModal = ({ infoMessage, isSending, onApprove, onClose }) => (
    <Modal
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

InfoModal.propTypes = {
    infoMessage: PropTypes.string.isRequired,
    isSending: PropTypes.bool.isRequired,
    onApprove: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default InfoModal;
