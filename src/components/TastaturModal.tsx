import React from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';

import { GammelModal } from '@components/Modal';
import { Action, Key, useKeyboard } from '@hooks/useKeyboard';
import { useKeyboardActions } from '@saksbilde/useKeyboardShortcuts';

import styles from './TastaturModal.module.css';

interface TastaturModalProps {
    isOpen: boolean;
    onSetVisTastatursnarveier: (open: boolean) => void;
}

export const TastaturModal = ({ isOpen, onSetVisTastatursnarveier }: TastaturModalProps) => {
    const tastatursnarveier: Action[] = useKeyboardActions();

    useKeyboard([
        {
            key: Key.F1,
            action: () => onSetVisTastatursnarveier(!isOpen),
            ignoreIfModifiers: false,
        },
    ]);

    return (
        <GammelModal
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
            </div>
        </GammelModal>
    );
};
