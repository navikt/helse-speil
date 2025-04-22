import React, { ReactElement } from 'react';

import { BodyShort, Heading, Modal } from '@navikt/ds-react';

import styles from './DagtypeModal.module.css';

type TastaturModalProps = {
    showModal: boolean;
    closeModal: () => void;
};

export const DagtypeModal = ({ showModal, closeModal }: TastaturModalProps): ReactElement => (
    <Modal aria-label="Dagtype modal" portal closeOnBackdropClick open={showModal} onClose={closeModal}>
        <Modal.Header>
            <Heading level="1" size="medium">
                Dagtyper
            </Heading>
        </Modal.Header>
        <Modal.Body className={styles.dagtypeliste}>
            <BodyShort weight="semibold">Syk (NAV)</BodyShort>
            <BodyShort>NAV skal betale alle eller noen av de første 16 dagene</BodyShort>
            <BodyShort weight="semibold">Ferie</BodyShort>
            <BodyShort>Bruker tok ferie i sykmeldingsperioden</BodyShort>
            <BodyShort weight="semibold">Arbeid ikke gjenopptatt</BodyShort>
            <BodyShort>
                Bruker tok ferie uten sykmelding
                <br />
                Bruker tok turnusfri
                <br />
                Brukers stillingsandel ikke fullt gjenopptatt
            </BodyShort>
            <BodyShort weight="semibold">Egenmelding</BodyShort>
            <BodyShort>Bruker hadde egenmeldt sykefravær</BodyShort>
            <BodyShort weight="semibold">Permisjon</BodyShort>
            <BodyShort>Bruker hadde permisjon</BodyShort>
            <BodyShort weight="semibold">Arbeid</BodyShort>
            <BodyShort>Bruker var i arbeid</BodyShort>
        </Modal.Body>
    </Modal>
);
