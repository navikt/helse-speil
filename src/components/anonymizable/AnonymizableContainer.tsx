import classNames from 'classnames';
import React, { forwardRef } from 'react';

import { OverridableComponent } from '@navikt/ds-react';

import styles from './Anonymous.module.css';

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

const AnonymizableContainerInner = forwardRef(
    ({ className, children, as: Component = 'div', ...rest }: ContainerProps & { as?: React.ElementType }, ref) => {
        return (
            <Component ref={ref} className={classNames(styles.Anonymous, className)} {...rest}>
                {children}
            </Component>
        );
    },
);

AnonymizableContainerInner.displayName = 'AnonymizableContainer';

export const AnonymizableContainer = AnonymizableContainerInner as OverridableComponent<ContainerProps, HTMLDivElement>;
