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
