import classNames from 'classnames';
import React from 'react';

import { Link, LinkProps } from '@navikt/ds-react';

import styles from './LinkButton.module.css';

export const LinkButton: React.FC<LinkProps> = ({ className, children, ...linkProps }) => {
    return (
        <Link className={classNames(styles.LinkButton, className)} {...linkProps}>
            {children}
        </Link>
    );
};
