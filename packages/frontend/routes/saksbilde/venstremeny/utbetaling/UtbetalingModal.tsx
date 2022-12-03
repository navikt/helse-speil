import styled from '@emotion/styled';
import React from 'react';

import { BodyShort, Button, Heading, Loader } from '@navikt/ds-react';

import { Modal } from '@components/Modal';

const Buttons = styled.div`
    margin-top: 2rem;

    > button:not(:last-of-type) {
        margin-right: 1rem;
    }
`;

const KnappMedSpinner = styled.div`
    display: flex;
    > svg {
        margin-left: 0.5rem;
    }
`;

const Container = styled.div`
    margin-top: 1.5rem;
`;

interface UtbetalingModalProps {
    isSending: boolean;
    onApprove: () => void;
    onClose: () => void;
    totrinnsvurdering: boolean;
}

export const UtbetalingModal = ({ isSending, onApprove, onClose, totrinnsvurdering }: UtbetalingModalProps) => (
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
            <BodyShort>
                Når du trykker ja{' '}
                {totrinnsvurdering
                    ? 'sendes saken til beslutter for godkjenning.'
                    : 'blir utbetalingen sendt til oppdragsystemet.'}
            </BodyShort>
            <Buttons>
                <Button variant="primary" onClick={onApprove} disabled={isSending}>
                    <KnappMedSpinner>
                        <span>Ja</span>
                        {isSending && <Loader size="xsmall" />}
                    </KnappMedSpinner>
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Avbryt
                </Button>
            </Buttons>
        </Container>
    </Modal>
);
