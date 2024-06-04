import classNames from 'classnames';
import React from 'react';

import { BodyShort, BodyShortProps } from '@navikt/ds-react';

import { AnonymizableText } from './anonymizable/AnonymizableText';

import styles from './TextWithEllipsis.module.css';

export const TextWithEllipsis: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
    className,
    children,
    ...paragrahProps
}) => {
    return (
        <BodyShort className={classNames(styles.TextWithEllipsis, className)} {...paragrahProps}>
            {children}
        </BodyShort>
    );
};

export const AnonymizableTextWithEllipsis: React.FC<BodyShortProps> = ({ className, children, ...paragrahProps }) => {
    return (
        <AnonymizableText className={classNames(styles.TextWithEllipsis, className)} {...paragrahProps}>
            {children}
        </AnonymizableText>
    );
};
