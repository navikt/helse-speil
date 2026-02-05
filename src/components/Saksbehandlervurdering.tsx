import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { Detail, Heading } from '@navikt/ds-react';

import { cn } from '@utils/tw';

import styles from './Vurdering.module.scss';

interface SaksbehandlervurderingProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    ident: string;
}

export const Saksbehandlervurdering = ({
    className,
    children,
    title,
    ident,
    ...divProps
}: SaksbehandlervurderingProps): ReactElement => (
    <div className={cn(styles.container, styles['container__saksbehandler'], className)} {...divProps}>
        <div className={styles.ikoncontainer}>
            <PersonPencilFillIcon color="var(--ax-text-neutral-contrast)" />
        </div>
        <div className={styles.column}>
            <Heading level="2" size="xsmall">
                {title}
            </Heading>
            <Detail textColor="subtle">Behandlet av {ident}</Detail>
        </div>
        {children}
    </div>
);
