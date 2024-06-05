import React, { ReactNode } from 'react';

import { BodyLong } from '@navikt/ds-react';

import styles from './Varselseksjon.module.css';

interface VarselseksjonProps extends ChildrenProps {
    tittel: ReactNode;
}

export const Varselseksjon: React.FC<VarselseksjonProps> = ({ tittel, children }) => (
    <div className={styles.container}>
        <BodyLong as="p" className={styles.tittel}>
            {tittel}
        </BodyLong>
        <BodyLong>{children}</BodyLong>
    </div>
);
