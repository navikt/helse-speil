import styles from './CardTitle.module.scss';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

interface CardTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = (props) => (
    <BodyShort className={styles.tittel} as="h3" {...props} />
);
