import classNames from 'classnames';
import React from 'react';

import { BodyShort, BodyShortProps } from '@navikt/ds-react';

import styles from './Bold.module.css';

export const Bold = ({ children, className, ...rest }: BodyShortProps) => (
    <BodyShort as="p" {...rest} className={classNames(styles.bold, className)}>
        {children}
    </BodyShort>
);
