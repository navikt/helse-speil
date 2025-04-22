import React, { PropsWithChildren, ReactElement } from 'react';

import { Button, Heading, Modal } from '@navikt/ds-react';

type SlettLokaleEndringerModalProps = {
    showModal: boolean;
    onApprove: () => void;
    closeModal: () => void;
    heading: string;
};

export const SlettLokaleEndringerModal = ({
    showModal,
    onApprove,
    closeModal,
    heading,
    children,
}: PropsWithChildren<SlettLokaleEndringerModalProps>): ReactElement => (
    <Modal aria-label="Slett lokale endringer modal" portal closeOnBackdropClick open={showModal} onClose={closeModal}>
        <Modal.Header>
            <Heading level="1" size="medium">
                {heading}
            </Heading>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
            <Button variant="primary" type="button" onClick={onApprove}>
                Ja
            </Button>
            <Button variant="tertiary" type="button" onClick={closeModal}>
                Avbryt
            </Button>
        </Modal.Footer>
    </Modal>
);
