import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import { PersonContext } from '../context/PersonContext';
import { Button } from './Button';
import { PersonoppdateringModal } from './PersonoppdateringModal';

const OppdaterKnapp = styled(Button)`
    border-radius: 0.25rem;
    height: 30px;
    width: 150px;
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

export const OppdaterPersondata = () => {
    const { personTilBehandling } = useContext(PersonContext);
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <>
            <OppdaterKnapp onClick={() => setShowModal(true)}>Oppdater</OppdaterKnapp>
            {showModal && <PersonoppdateringModal person={personTilBehandling!} onClose={() => setShowModal(false)} />}
        </>
    );
};
