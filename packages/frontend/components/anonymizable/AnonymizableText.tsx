import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';
import { BodyShortProps } from '@navikt/ds-react/esm/typography/BodyShort';

import styles from './Anonymous.module.css';

export const AnonymizableText: React.FC<BodyShortProps> = ({ children, className, ...paragraphProps }) => {
    return (
        <BodyShort className={classNames(styles.Anonymous, className)} {...paragraphProps}>
            {children}
        </BodyShort>
    );
};
