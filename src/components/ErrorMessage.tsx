import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import styles from './ErrorMessage.module.css';

type ErrorMessageProps = React.HTMLAttributes<HTMLParagraphElement>;

export const ErrorMessage = ({ children, className, ...rest }: ErrorMessageProps): ReactElement => (
    <BodyShort as="p" {...rest} className={classNames(styles.error, className)}>
        {children}
    </BodyShort>
);
