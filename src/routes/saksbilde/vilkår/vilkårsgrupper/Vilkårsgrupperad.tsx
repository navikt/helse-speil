import React, { ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import styles from './Vilkarsgrupperad.module.css';

interface Props {
    label: string;
    children: ReactNode | ReactNode[];
}

export const Vilkårsgrupperad = ({ label, children }: Props) => (
    <>
        <BodyShort className={styles.Navn}>{label}</BodyShort>
        <div className={styles.Verdi}>{children}</div>
    </>
);
