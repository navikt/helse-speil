import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import styles from './ErrorMessage.module.css';

export const ErrorMessage = ({
    children,
    className,
    ...rest
}: React.HTMLAttributes<HTMLParagraphElement>): ReactElement => (
    <BodyShort as="p" {...rest} className={classNames(styles.error, className)}>
        {children}
    </BodyShort>
);
