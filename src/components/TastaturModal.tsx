import React from 'react';

import { BodyShort, Heading, Modal } from '@navikt/ds-react';

import { Action, Key, useKeyboard } from '@hooks/useKeyboard';
import { useKeyboardActions } from '@saksbilde/useKeyboardShortcuts';

import styles from './TastaturModal.module.css';

type TastaturModalProps = {
    setShowModal: (visModal: boolean) => void;
    showModal: boolean;
};

export const TastaturModal = ({ setShowModal, showModal }: TastaturModalProps) => {
    const tastatursnarveier: Action[] = useKeyboardActions();

    useKeyboard([
        {
            key: Key.F1,
            action: () => setShowModal(!showModal),
            ignoreIfModifiers: false,
        },
    ]);

    return (
        <Modal
            aria-label="Tastatursnarveier modal"
            portal
            closeOnBackdropClick
            open={showModal}
            onClose={() => setShowModal(false)}
        >
            <Modal.Header>
                <Heading level="1" size="large">
                    Tastatursnarveier
                </Heading>
            </Modal.Header>
            <Modal.Body>
                {Object.entries(tastatursnarveier)
                    .filter((snarvei) => snarvei[1]?.visningssnarvei !== undefined)
                    .map((snarvei, i) => {
                        return (
                            <BodyShort className={styles.snarveisrad} key={`snarvei${i}`}>
                                <span className={styles.snarvei}>
                                    {snarvei[1].visningssnarvei?.map((snarvei, index) => (
                                        <span key={`tast${i}${index}`}>{snarvei}</span>
                                    ))}
                                </span>
                                {snarvei[1].visningstekst}
                            </BodyShort>
                        );
                    })}
            </Modal.Body>
        </Modal>
    );
};
