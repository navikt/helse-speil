import React from 'react';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import './ErrorModal.css';
import { Knapp } from 'nav-frontend-knapper';

Modal.setAppElement('#root');

interface Props {
    errorMessage: string;
    onClose?: () => void;
}

const ErrorModal = ({ errorMessage, onClose }: Props) => (
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

export default ErrorModal;
