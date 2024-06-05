import classNames from 'classnames';
import React from 'react';

import { BodyShort, BodyShortProps } from '@navikt/ds-react';

import styles from './Anonymous.module.css';

export const AnonymizableText: React.FC<BodyShortProps> = ({ children, className, ...paragraphProps }) => {
    return (
        <BodyShort className={classNames(styles.Anonymous, className)} {...paragraphProps}>
            {children}
        </BodyShort>
    );
};
