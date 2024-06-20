import NextLink from 'next/link';
import React, { ReactElement } from 'react';

import { BodyShort, Button, Heading, Modal } from '@navikt/ds-react';

type TimeoutModalProps = {
    showModal: boolean;
    onClose: () => void;
};

export const TimeoutModal = ({ showModal, onClose }: TimeoutModalProps): ReactElement => (
    <Modal
        aria-label="Kalkuleringen tar tid modal"
        portal
        closeOnBackdropClick
        open={showModal}
        onClose={onClose}
        width="450px"
    >
        <Modal.Header>
            <Heading level="1" size="medium">
                Kalkuleringen ser ut til å ta noe tid
            </Heading>
        </Modal.Header>
        <Modal.Body>
            <BodyShort>Oppgaven vil dukke opp i oversikten når den er klar.</BodyShort>
        </Modal.Body>
        <Modal.Footer>
            <Button as={NextLink} variant="secondary" href="/">
                Tilbake til oversikten
            </Button>
            <Button variant="tertiary" onClick={onClose}>
                Det er greit
            </Button>
        </Modal.Footer>
    </Modal>
);
