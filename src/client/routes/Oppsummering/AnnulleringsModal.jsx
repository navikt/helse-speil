import React, { useState } from 'react';
import Modal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';

Modal.setAppElement('#root');

const AnnulleringsModal = ({ onApprove, faktiskNavIdent, onClose }) => {
    const [input, setInput] = useState('');
    const [error, setError] = useState(undefined);
    const onValidering = () => {
        console.log(faktiskNavIdent);
        if (input.toLowerCase() !== faktiskNavIdent.toLowerCase()) {
            setError('Du må skrive inn riktig NAV-brukerident.');
        } else {
            onApprove();
        }
    };
    return (
        <Modal
            className="AnnulleringsModal"
            isOpen={true}
            contentLabel="Bekreft annullering"
            closeButton={true}
            onRequestClose={onClose}
        >
            <Systemtittel>Er du sikker på at du vil annullere utbetalingen?</Systemtittel>
            <Normaltekst>
                Hvis du annullerer utbetalingen, vil den fjernes fra oppdragssystemet og du må
                behandle saken manuelt i Infotrygd.
            </Normaltekst>
            <Normaltekst>
                For å gjennomføre annulleringen må du skrive inn din NAV-brukerident i feltet under.
            </Normaltekst>
            <div>
                <input
                    type="text"
                    placeholder="NAV-brukerident"
                    onChange={e => setInput(e.target.value)}
                    value={input}
                />
            </div>
            <div>
                <Hovedknapp onClick={onValidering}>Annuller</Hovedknapp>
            </div>
            {error && <Normaltekst className="skjemaelement__feilmelding">{error}</Normaltekst>}
        </Modal>
    );
};

AnnulleringsModal.propTypes = {
    onApprove: PropTypes.func.isRequired,
    faktiskNavIdent: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

export default AnnulleringsModal;
