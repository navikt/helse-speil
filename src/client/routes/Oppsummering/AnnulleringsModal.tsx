import React, { useState } from 'react';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { Input } from 'nav-frontend-skjema';
import './AnnulleringsModal.less';

Modal.setAppElement('#root');

interface Props {
    onApprove: () => void;
    onClose: () => void;
    senderAnnullering: boolean;
    faktiskNavIdent?: string;
}

const AnnulleringsModal = ({ onApprove, faktiskNavIdent, onClose, senderAnnullering }: Props) => {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | undefined>(undefined);

    const onValidering = () => {
        console.log(faktiskNavIdent);
        if (input.toLowerCase() !== faktiskNavIdent?.toLowerCase()) {
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
            <Undertittel>Er du sikker på at du vil annullere utbetalingen?</Undertittel>
            <Normaltekst>
                Hvis du annullerer utbetalingen, vil den fjernes fra oppdragssystemet og du må
                behandle saken manuelt i Infotrygd.
            </Normaltekst>
            <Normaltekst>
                For å gjennomføre annulleringen må du skrive inn din NAV-brukerident i feltet under.
            </Normaltekst>
            <Input
                label=""
                aria-label="NAV-brukerident"
                placeholder="NAV-brukerident"
                className="AnnulleringsModal__identInput"
                onChange={e => setInput(e.target.value)}
                value={input}
            />
            <div className="knapperad">
                <Knapp spinner={senderAnnullering} onClick={onValidering}>
                    Annuller
                </Knapp>
                <Flatknapp onClick={onClose}>Avbryt</Flatknapp>
            </div>
            {error && <Normaltekst className="skjemaelement__feilmelding">{error}</Normaltekst>}
        </Modal>
    );
};

export default AnnulleringsModal;
