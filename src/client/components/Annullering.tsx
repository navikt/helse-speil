import React, { useState } from 'react';
import styled from '@emotion/styled';
import { AnnulleringModal } from './AnnulleringModal/AnnulleringModal';
import { AnnulleringDTO, postAnnullering } from '../io/http';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/authentication';

const AnnullerKnapp = styled.button`
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    cursor: pointer;
    background: none;
    border: none;
    border-radius: 0.25rem;
    height: 30px;
    width: 150px;
    outline: none;
    font-size: 1rem;
    white-space: nowrap;

    &:hover,
    &:focus {
        background: #e7e9e9;
    }
    &:active {
        background: #e1e4e4;
    }
`;

const Annullering = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [feilmelding, setFeilmelding] = useState<string>();
    const { ident } = useRecoilValue(authState);
    const sendAnnullering = (annullering: AnnulleringDTO) => {
        setIsSending(true);
        setFeilmelding(undefined);
        postAnnullering(annullering)
            .then(() => setModalOpen(false))
            .catch(() => setFeilmelding('Noe gikk galt. Kontakt en utvikler.'))
            .finally(() => setIsSending(false));
    };

    return (
        <>
            <AnnullerKnapp tabIndex={0} onClick={() => setModalOpen((verdi) => !verdi)}>
                Annuller
            </AnnullerKnapp>
            {modalOpen && (
                <AnnulleringModal
                    onClose={() => setModalOpen((verdi) => !verdi)}
                    onApprove={sendAnnullering}
                    isSending={isSending}
                    ident={ident!}
                    feilmelding={feilmelding}
                />
            )}
        </>
    );
};

export default Annullering;
