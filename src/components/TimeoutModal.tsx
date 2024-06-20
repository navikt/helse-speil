import { useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';

import { GammelModal } from './Modal';

import styles from './TimeoutModal.module.scss';

type TimeoutModalProps = {
    onRequestClose: () => void;
};

export const TimeoutModal = ({ onRequestClose }: TimeoutModalProps): Maybe<ReactElement> => {
    const router = useRouter();
    const [open, setOpen] = useState(true);

    const redirectTilOversikten = () => {
        router.push('/');
    };

    const closeModal = () => {
        onRequestClose();
        setOpen(false);
    };

    if (!open) {
        return null;
    }

    return (
        <GammelModal contentLabel="Kalkuleringen ser ut til å ta noe tid" isOpen onRequestClose={closeModal}>
            <div className={styles.content}>
                <p className={styles.tekst}>Kalkuleringen ser ut til å ta noe tid.</p>
                <p className={styles.tekst}>Oppgaven vil dukke opp i oversikten når den er klar.</p>
                <span className={styles.knappegruppe}>
                    {/*TODO: Dette burde bare ære en lenke*/}
                    <Button size="small" variant="secondary" onClick={redirectTilOversikten}>
                        Tilbake til oversikten
                    </Button>
                    <Button size="small" variant="tertiary" onClick={closeModal}>
                        Det er greit
                    </Button>
                </span>
            </div>
        </GammelModal>
    );
};
