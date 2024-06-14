import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import styles from './vilkår.module.css';

interface VilkårskategoriProps extends React.HTMLAttributes<HTMLDivElement> {
    ikon: ReactNode;
}

export const Vilkårskategori = ({ children, ikon, ...rest }: VilkårskategoriProps) => (
    <div className={classNames('vilkårskategori', [styles.kategori])} {...rest}>
        <div className={styles.ikon}>{ikon}</div>
        <BodyShort>{children}</BodyShort>
    </div>
);
