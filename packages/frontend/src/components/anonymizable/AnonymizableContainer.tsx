import classNames from 'classnames';
import React, { forwardRef } from 'react';

import { OverridableComponent } from '@navikt/ds-react';

import styles from './Anonymous.module.css';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const AnonymizableContainer: OverridableComponent<ContainerProps, HTMLDivElement> = forwardRef(
    ({ className, children, as: Component = 'div', ...rest }, ref) => {
        return (
            <Component ref={ref} className={classNames(styles.Anonymous, className)} {...rest}>
                {children}
            </Component>
        );
    },
);
