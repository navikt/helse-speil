import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import styles from './ErrorMessage.module.css';

type ErrorMessageProps = React.HTMLAttributes<HTMLParagraphElement>;

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ children, ...rest }) => (
    <BodyShort as="p" {...rest} className={classNames(styles.error, rest.className)}>
        {children}
    </BodyShort>
);
