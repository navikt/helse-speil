import React, { ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import styles from './Vilkårsgrupperad.module.css';

interface Props {
    label: string;
    children: ReactNode | ReactNode[];
}

export const Vilkårsgrupperad = ({ label, children }: Props) => (
    <>
        <BodyShort className={styles.Navn} as="p">
            {label}
        </BodyShort>
        <div className={styles.Verdi}>{children}</div>
    </>
);
