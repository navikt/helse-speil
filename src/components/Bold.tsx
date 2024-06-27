import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort, BodyShortProps } from '@navikt/ds-react';

import styles from './Bold.module.css';

export const Bold = ({ children, className, ...rest }: BodyShortProps): ReactElement => (
    <BodyShort as="p" {...rest} className={classNames(styles.bold, className)}>
        {children}
    </BodyShort>
);
