import classNames from 'classnames';
import React from 'react';

import { BodyShortProps } from '@navikt/ds-react/esm/typography/BodyShort';

import { AnonymizableText } from './anonymizable/AnonymizableText';

import styles from './TextWithEllipsis.module.css';

export const TextWithEllipsis: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
    className,
    ...paragrahProps
}) => {
    return <p className={classNames(styles.TextWithEllipsis, className)} {...paragrahProps} />;
};

export const AnonymizableTextWithEllipsis: React.FC<BodyShortProps> = ({ className, children, ...paragrahProps }) => {
    return (
        <AnonymizableText className={classNames(styles.TextWithEllipsis, className)} {...paragrahProps}>
            {children}
        </AnonymizableText>
    );
};
