import React, { useState } from 'react';
import styled from '@emotion/styled';
import InfoModal from './InfoModal';

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
    console.log(modalOpen);
    return (
        <>
            <AnnullerKnapp tabIndex={0} onClick={() => setModalOpen(verdi => !verdi)}>
                Annuller
            </AnnullerKnapp>
            {modalOpen && (
                <InfoModal
                    onClose={() => setModalOpen(verdi => !verdi)}
                    onApprove={() => null}
                    isSending={false}
                    infoMessage="Når du trykker ja blir utbetalingen sendt til oppdragsystemet."
                />
            )}
        </>
    );
};

export default Annullering;
