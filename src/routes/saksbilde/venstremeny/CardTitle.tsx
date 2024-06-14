import styles from './CardTitle.module.scss';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

type CardTitleProps = React.HTMLAttributes<HTMLParagraphElement>;

export const CardTitle = ({ children, ...props }: CardTitleProps) => (
    <BodyShort className={styles.tittel} as="h3" {...props}>
        {children}
    </BodyShort>
);
