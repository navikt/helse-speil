import React from 'react';

import { BodyShort, Heading, Modal } from '@navikt/ds-react';

import { Action } from '@hooks/useKeyboard';
import { useKeyboardActions } from '@saksbilde/useKeyboardShortcuts';

import styles from './TastaturModal.module.css';

type TastaturModalProps = {
    onClose: () => void;
    showModal: boolean;
};

export const TastaturModal = ({ onClose, showModal }: TastaturModalProps) => {
    const tastatursnarveier: Action[] = useKeyboardActions();

    return (
        <Modal aria-label="Tastatursnarveier modal" portal closeOnBackdropClick open={showModal} onClose={onClose}>
            <Modal.Header>
                <Heading level="1" size="medium">
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
