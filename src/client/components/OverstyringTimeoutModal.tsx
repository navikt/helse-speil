import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

import { Flatknapp, Knapp } from 'nav-frontend-knapper';

import { Modal } from './Modal';

const Knappegruppe = styled.span`
    display: flex;

    > button:not(:last-of-type) {
        margin-right: 1rem;
    }
`;

const Content = styled.div`
    padding: 1rem;
`;

const Tekst = styled.p`
    margin-bottom: 0.5rem;

    &:last-of-type {
        margin-bottom: 2rem;
    }
`;

interface Props {
    onRequestClose: () => void;
}

export const OverstyringTimeoutModal = ({ onRequestClose }: Props) => {
    const history = useHistory();
    const [open, setOpen] = useState(true);

    const redirectTilOversikten = () => {
        history.push('/');
    };

    const closeModal = () => {
        onRequestClose();
        setOpen(false);
    };

    if (!open) {
        return null;
    }

    return (
        <Modal contentLabel="Kalkuleringen ser ut til å ta noe tid" isOpen onRequestClose={closeModal}>
            <Content>
                <Tekst>Kalkuleringen ser ut til å ta noe tid.</Tekst>
                <Tekst>Oppgaven vil dukke opp i oversikten når den er klar.</Tekst>
                <Knappegruppe>
                    <Knapp mini onClick={redirectTilOversikten}>
                        Tilbake til oversikten
                    </Knapp>
                    <Flatknapp mini onClick={closeModal}>
                        Avbryt
                    </Flatknapp>
                </Knappegruppe>
            </Content>
        </Modal>
    );
};
