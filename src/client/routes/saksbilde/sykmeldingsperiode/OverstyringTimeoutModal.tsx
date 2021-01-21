import React from 'react';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import styled from '@emotion/styled';
import { Modal } from '../../../components/Modal';
import { useHistory } from 'react-router';

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

    const redirectTilOversikten = () => history.push('/');

    return (
        <Modal contentLabel="Kalkuleringen ser ut til å ta noe tid" isOpen onRequestClose={onRequestClose}>
            <Content>
                <Tekst>Kalkuleringen ser ut til å ta noe tid.</Tekst>
                <Tekst>Oppgaven vil dukke opp i oversikten når den er klar.</Tekst>
                <Knappegruppe>
                    <Knapp mini onClick={redirectTilOversikten}>
                        Tilbake til oversikten
                    </Knapp>
                    <Flatknapp mini onClick={onRequestClose}>
                        Avbryt
                    </Flatknapp>
                </Knappegruppe>
            </Content>
        </Modal>
    );
};
