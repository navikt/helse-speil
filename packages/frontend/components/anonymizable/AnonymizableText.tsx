import React from 'react';
import classNames from 'classnames';
import { BodyShort } from '@navikt/ds-react';

import styles from './Anonymous.module.css';
import { BodyShortProps } from '@navikt/ds-react/esm/typography/BodyShort';

export const AnonymizableText: React.FC<BodyShortProps> = ({ children, className, ...paragraphProps }) => {
    return (
        <BodyShort className={classNames(styles.Anonymous, className)} {...paragraphProps}>
            {children}
        </BodyShort>
    );
};
