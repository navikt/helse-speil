import React from 'react';
import Modal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import './ErrorModal.css';
import { Knapp } from 'nav-frontend-knapper';

Modal.setAppElement('#root');

const ErrorModal = ({ errorMessage, onClose }) => (
    <Modal
        className="ErrorModal"
        isOpen={true}
        contentLabel="Feilmelding"
        closeButton={false}
        onRequestClose={onClose || (() => {})}
    >
        <Systemtittel>Det har oppstått en feil</Systemtittel>
        <Normaltekst>{errorMessage}</Normaltekst>
        <Knapp
            onClick={() => {
                console.log(onClose);
                if (onClose) {
                    onClose();
                } else {
                    window.location.reload();
                }
            }}
        >
            {onClose ? 'Ok' : 'Last inn på nytt'}
        </Knapp>
    </Modal>
);

ErrorModal.propTypes = {
    errorMessage: PropTypes.string.isRequired,
    onClose: PropTypes.func
};

ErrorModal.defaultProps = {
    onClose: undefined
};

export default ErrorModal;
