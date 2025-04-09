import React, { ReactElement } from 'react';

import { BodyShort, Heading, Modal } from '@navikt/ds-react';

import { Action } from '@hooks/useKeyboard';
import { useKeyboardActions } from '@hooks/useKeyboardShortcuts';

import styles from './TastaturModal.module.css';

type TastaturModalProps = {
    onClose: () => void;
    showModal: boolean;
};

export const TastaturModal = ({ onClose, showModal }: TastaturModalProps): ReactElement => {
    const tastatursnarveier: Action[] = useKeyboardActions();
    const [utviklerOnlySnarveier, snarveier] = tastatursnarveier.reduce<[Action[], Action[]]>(
        ([a, b], snarvei) => (snarvei.utviklerOnly ? [[...a, snarvei], b] : [a, [...b, snarvei]]),
        [[], []],
    );

    return (
        <Modal aria-label="Tastatursnarveier modal" portal closeOnBackdropClick open={showModal} onClose={onClose}>
            <Modal.Header>
                <Heading level="1" size="medium">
                    Tastatursnarveier
                </Heading>
            </Modal.Header>
            <Modal.Body>
                {snarveier
                    .filter((snarvei) => snarvei?.visningssnarvei !== undefined)
                    .map((snarvei, i) => {
                        return (
                            <BodyShort className={styles.snarveisrad} key={`snarvei${i}`}>
                                <span className={styles.snarvei}>
                                    {snarvei.visningssnarvei?.map((snarvei, index) => (
                                        <span key={`tast${i}${index}`}>{snarvei}</span>
                                    ))}
                                </span>
                                {snarvei.visningstekst}
                            </BodyShort>
                        );
                    })}
                {utviklerOnlySnarveier.length > 0 && (
                    <>
                        <Heading level="2" size="small" className={styles.utviklersnacks}>
                            Utviklersnacks
                        </Heading>
                        {utviklerOnlySnarveier
                            .filter((snarvei) => snarvei?.visningssnarvei !== undefined)
                            .map((snarvei, i) => (
                                <BodyShort className={styles.snarveisrad} key={`snarvei${i}`}>
                                    <span className={styles.snarvei}>
                                        {snarvei.visningssnarvei?.map((tast, index) => (
                                            <span key={`tast${i}${index}`}>{tast}</span>
                                        ))}
                                    </span>
                                    {snarvei.visningstekst}
                                </BodyShort>
                            ))}
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};
