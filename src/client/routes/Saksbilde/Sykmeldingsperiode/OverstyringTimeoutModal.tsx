import React from 'react';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import styled from '@emotion/styled';
import { Modal } from '../../../components/Modal';
import { Undertittel } from 'nav-frontend-typografi';
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

const Tittel = styled(Undertittel)`
    padding: 0 1rem;
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
                <Tekst>Du kan legge saken på vent og komme tilbake til den senere.</Tekst>
                <Knappegruppe>
                    <Knapp mini onClick={redirectTilOversikten}>
                        Legg på vent
                    </Knapp>
                    <Flatknapp mini onClick={onRequestClose}>
                        Avbryt
                    </Flatknapp>
                </Knappegruppe>
            </Content>
        </Modal>
    );
};
