import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';

import { BodyLong } from '@navikt/ds-react';

import styles from './Varselseksjon.module.css';

type VarselseksjonProps = {
    tittel: ReactNode;
};

export const Varselseksjon = ({ tittel, children }: PropsWithChildren<VarselseksjonProps>): ReactElement => (
    <div className={styles.container}>
        <BodyLong as="p" className={styles.tittel}>
            {tittel}
        </BodyLong>
        <BodyLong>{children}</BodyLong>
    </div>
);
