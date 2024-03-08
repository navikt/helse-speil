import styles from './Widget.module.scss';
import React, { useState } from 'react';

import { Button } from '@navikt/ds-react';

interface WidgetProps {
    children: React.ReactNode;
}
export const Widget = ({ children }: WidgetProps) => {
    const [open, setOpen] = useState(false);

    return open ? (
        <div className={styles.widget}>
            <Button className={styles.close} onClick={() => setOpen(false)} />
            {children}
        </div>
    ) : (
        <Button className={styles.button} onClick={() => setOpen(true)}>
            Tilbakemelding
        </Button>
    );
};
