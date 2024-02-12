import styles from './TimeoutModal.module.scss';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@navikt/ds-react';

import { Modal } from './Modal';

interface Props {
    onRequestClose: () => void;
}

export const TimeoutModal = ({ onRequestClose }: Props) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);

    const redirectTilOversikten = () => {
        navigate('/');
    };

    const closeModal = () => {
        onRequestClose();
        setOpen(false);
    };

    if (!open) {
        return null;
    }

    return (
        <Modal contentLabel="Kalkuleringen ser ut til å ta noe tid" isOpen onRequestClose={closeModal}>
            <div className={styles.content}>
                <p className={styles.tekst}>Kalkuleringen ser ut til å ta noe tid.</p>
                <p className={styles.tekst}>Oppgaven vil dukke opp i oversikten når den er klar.</p>
                <span className={styles.knappegruppe}>
                    <Button size="small" variant="secondary" onClick={redirectTilOversikten}>
                        Tilbake til oversikten
                    </Button>
                    <Button size="small" variant="tertiary" onClick={closeModal}>
                        Det er greit
                    </Button>
                </span>
            </div>
        </Modal>
    );
};
