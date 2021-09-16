import styled from '@emotion/styled';
import React from 'react';

import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { BodyShort, Title } from '@navikt/ds-react';

import { Modal } from '../../../../components/Modal';

const Knapper = styled.div`
    margin-top: 2rem;

    > button:not(:last-of-type) {
        margin-right: 1rem;
    }
`;

const Container = styled.div`
    margin-top: 1.5rem;
`;

interface Props {
    isSending: boolean;
    onApprove: () => void;
    onClose: () => void;
}

export const Utbetalingsmodal = ({ isSending, onApprove, onClose }: Props) => (
    <Modal
        isOpen
        title={
            <Title component="h2" size="l">
                Er du sikker?
            </Title>
        }
        contentLabel="Godkjenn utbetaling"
        onRequestClose={onClose}
    >
        <Container>
            <BodyShort>Når du trykker ja blir utbetalingen sendt til oppdragsystemet.</BodyShort>
            <Knapper>
                <Hovedknapp spinner={isSending} onClick={onApprove} autoDisableVedSpinner>
                    Ja
                </Hovedknapp>
                <Knapp onClick={onClose}>Avbryt</Knapp>
            </Knapper>
        </Container>
    </Modal>
);
