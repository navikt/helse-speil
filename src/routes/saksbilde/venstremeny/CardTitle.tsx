import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import styles from './CardTitle.module.scss';

type CardTitleProps = React.HTMLAttributes<HTMLParagraphElement>;

export const CardTitle = ({ children, ...props }: CardTitleProps) => (
    <BodyShort className={styles.tittel} as="h3" {...props}>
        {children}
    </BodyShort>
);
