import styled from '@emotion/styled';
import React from 'react';

import { BodyShort, Button, Loader, Heading } from '@navikt/ds-react';

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
            <Heading as="h2" size="large">
                Er du sikker?
            </Heading>
        }
        contentLabel="Godkjenn utbetaling"
        onRequestClose={onClose}
    >
        <Container>
            <BodyShort>Når du trykker ja blir utbetalingen sendt til oppdragsystemet.</BodyShort>
            <Buttons>
                <Button variant="primary" onClick={onApprove} disabled={isSending}>
                    Ja
                    {isSending && <Loader size="xsmall" />}
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Avbryt
                </Button>
            </Buttons>
        </Container>
    </Modal>
);
