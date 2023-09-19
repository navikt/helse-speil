import React from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';

import { Modal } from '@components/Modal';
import { Key, useKeyboard } from '@hooks/useKeyboard';

import { useKeyboardActions } from '../routes/saksbilde/useKeyboardShortcuts';

import styles from './TastaturModal.module.css';

interface TastaturModalProps {
    isOpen: boolean;
    onSetVisTastatursnarveier: (open: boolean) => void;
}
export const TastaturModal = ({ isOpen, onSetVisTastatursnarveier }: TastaturModalProps) => {
    const tastatursnarveier = useKeyboardActions();

    useKeyboard({
        [Key.F1]: {
            action: () => onSetVisTastatursnarveier(!isOpen),
            ignoreIfModifiers: false,
        },
    });

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => onSetVisTastatursnarveier(false)}
            aria-labelledby="modal-heading"
            title={
                <Heading as="h2" size="large">
                    Tastatursnarveier
                </Heading>
            }
        >
            <div className={styles.snarveisliste}>
                {Object.entries(tastatursnarveier).map((snarvei) => {
                    return (
                        <BodyShort className={styles.snarveisrad}>
                            <div className={styles.snarvei}>
                                {snarvei[1].visningssnarvei.map((snarvei) => (
                                    <span>{snarvei}</span>
                                ))}
                            </div>
                            {snarvei[1].visningstekst}
                        </BodyShort>
                    );
                })}
            </div>
        </Modal>
    );
};
