import classNames from 'classnames';
import React, { forwardRef } from 'react';

import { OverridableComponent } from '@navikt/ds-react';

import styles from './Anonymous.module.css';

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const AnonymizableContainer: OverridableComponent<ContainerProps, HTMLDivElement> = forwardRef(
    ({ className, children, as: Component = 'div', ...rest }, ref) => {
        return (
            <Component ref={ref} className={classNames(styles.Anonymous, className)} {...rest}>
                {children}
            </Component>
        );
    },
);
