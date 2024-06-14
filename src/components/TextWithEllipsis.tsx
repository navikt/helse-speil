import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort, BodyShortProps } from '@navikt/ds-react';

import { AnonymizableText } from './anonymizable/AnonymizableText';

import styles from './TextWithEllipsis.module.css';

type TextWithEllipsisProps = React.HTMLAttributes<HTMLParagraphElement>;

export const TextWithEllipsis = ({ className, children, ...paragrahProps }: TextWithEllipsisProps): ReactElement => {
    return (
        <BodyShort className={classNames(styles.TextWithEllipsis, className)} {...paragrahProps}>
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
        <AnonymizableText className={classNames(styles.TextWithEllipsis, className)} {...paragrahProps}>
            {children}
        </AnonymizableText>
    );
};
