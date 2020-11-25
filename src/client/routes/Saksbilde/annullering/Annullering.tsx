import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import { Annulleringsmodal } from './Annulleringsmodal';
import { PersonContext } from '../../../context/PersonContext';
import { Button } from '../../../components/Button';
import { DropdownContext } from '../../../components/Dropdown';

const AnnullerKnapp = styled(Button)`
    border-radius: 0.25rem;
    height: 30px;
    width: 180px;
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

export const Annullering = () => {
    const { personTilBehandling, aktivVedtaksperiode } = useContext(PersonContext);
    const { lukk } = useContext(DropdownContext);
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <>
            <AnnullerKnapp onClick={() => setShowModal(true)}>Annuller</AnnullerKnapp>
            {showModal && (
                <Annulleringsmodal
                    person={personTilBehandling!}
                    vedtaksperiode={aktivVedtaksperiode!}
                    onClose={() => {
                        setShowModal(false);
                        lukk();
                    }}
                />
            )}
        </>
    );
};
