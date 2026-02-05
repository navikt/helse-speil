import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { cn } from '@utils/tw';

import styles from './Anonymous.module.css';

export const AnonymizableBold = ({
    children,
    className,
    ...paragraphProps
}: React.HTMLAttributes<HTMLParagraphElement>): ReactElement => {
    return (
        <BodyShort weight="semibold" className={cn(styles.Anonymous, className)} {...paragraphProps}>
            {children}
        </BodyShort>
    );
};
