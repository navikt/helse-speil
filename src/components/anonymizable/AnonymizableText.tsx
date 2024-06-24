import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort, BodyShortProps } from '@navikt/ds-react';

import styles from './Anonymous.module.css';

export const AnonymizableText = ({ children, className, ...paragraphProps }: BodyShortProps): ReactElement => {
    return (
        <BodyShort className={classNames(styles.Anonymous, className)} {...paragraphProps}>
            {children}
        </BodyShort>
    );
};

export const AnonymizableTextWithEllipsis = ({
    className,
    children,
    ...paragrahProps
}: BodyShortProps): ReactElement => {
    return (
        <AnonymizableText truncate className={className} {...paragrahProps}>
            {children}
        </AnonymizableText>
    );
};
