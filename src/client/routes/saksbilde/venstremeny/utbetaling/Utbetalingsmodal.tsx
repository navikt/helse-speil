import styled from '@emotion/styled';
import React from 'react';

import { BodyShort, Button, Loader, Title } from '@navikt/ds-react';

import { Modal } from '../../../../components/Modal';

const Buttons = styled.div`
    margin-top: 2rem;

    > button:not(:last-of-type) {
        margin-right: 1rem;
    }

    > button > svg {
        margin-left: 0.5rem;
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
            <Buttons>
                <Button variant="action" onClick={onApprove} disabled={isSending}>
                    Ja
                    {isSending && <Loader size="xs" />}
                </Button>
                <Button onClick={onClose}>Avbryt</Button>
            </Buttons>
        </Container>
    </Modal>
);
