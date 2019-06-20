import React from 'react';
import Modal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import './ErrorModal.css';
import { Knapp } from 'nav-frontend-knapper';

Modal.setAppElement('#root');

const ErrorModal = ({ errorMessage }) => (
    <Modal
        className="ErrorModal"
        isOpen={true}
        contentLabel="Feilmelding"
        closeButton={false}
    >
        <Systemtittel>Det har oppstått en feil</Systemtittel>
        <Normaltekst>{errorMessage}</Normaltekst>
        <Normaltekst>Prøv igjen senere.</Normaltekst>
        <Knapp onClick={() => window.location.reload()}>
            Last inn på nytt
        </Knapp>
    </Modal>
);

ErrorModal.propTypes = {
    errorMessage: PropTypes.string.isRequired
};

export default ErrorModal;
