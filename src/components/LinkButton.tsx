import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { Link, LinkProps } from '@navikt/ds-react';

import styles from './LinkButton.module.css';

export const LinkButton = ({ className, children, ...linkProps }: LinkProps): ReactElement => {
    return (
        <Link className={classNames(styles.LinkButton, className)} {...linkProps}>
            {children}
        </Link>
    );
};
