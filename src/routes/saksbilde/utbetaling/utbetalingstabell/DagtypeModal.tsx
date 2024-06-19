import React, { ReactElement } from 'react';

import { BodyShort, Heading, Modal } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Key, useKeyboard } from '@hooks/useKeyboard';

import styles from './DagtypeModal.module.css';

type TastaturModalProps = {
    setShowModal: (visModal: boolean) => void;
    showModal: boolean;
};

export const DagtypeModal = ({ setShowModal, showModal }: TastaturModalProps): ReactElement => {
    useKeyboard([
        {
            key: Key.D,
            action: () => setShowModal(!showModal),
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

    return (
        <Modal
            aria-label="Dagtype modal"
            portal
            closeOnBackdropClick
            open={showModal}
            onClose={() => setShowModal(false)}
        >
            <Modal.Header>
                <Heading level="1" size="medium">
                    Dagtyper
                </Heading>
            </Modal.Header>
            <Modal.Body className={styles.dagtypeliste}>
                <Bold>Syk (NAV)</Bold>
                <BodyShort>NAV skal betale alle eller noen av de første 16 dagene</BodyShort>
                <Bold>Ferie</Bold>
                <BodyShort>Bruker tok ferie i sykmeldingsperioden</BodyShort>
                <Bold>Arbeid ikke gjenopptatt</Bold>
                <BodyShort>
                    Bruker tok ferie uten sykmelding
                    <br />
                    Bruker tok turnusfri
                    <br />
                    Brukers stillingsandel ikke fullt gjenopptatt
                </BodyShort>
                <Bold>Egenmelding</Bold>
                <BodyShort>Bruker hadde egenmeldt sykefravær</BodyShort>
                <Bold>Permisjon</Bold>
                <BodyShort>Bruker hadde permisjon</BodyShort>
                <Bold>Arbeid</Bold>
                <BodyShort>Bruker var i arbeid</BodyShort>
            </Modal.Body>
        </Modal>
    );
};
