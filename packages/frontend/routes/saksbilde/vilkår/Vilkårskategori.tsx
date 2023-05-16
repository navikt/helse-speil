import { IkonContainer } from './Vilkår.styles';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import styles from './Vilkarskategori.module.css';

interface VilkårskategoriProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode | ReactNode[];
    ikon: ReactNode;
}

export const Vilkårskategori = ({ children, ikon, className, ...rest }: VilkårskategoriProps) => (
    <div className={classNames('vilkårskategori', [styles.Container])} {...rest}>
        <IkonContainer>{ikon}</IkonContainer>
        <BodyShort>{children}</BodyShort>
    </div>
);
