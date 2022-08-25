import React, { useState } from 'react';
import classNames from 'classnames';
import { Accordion } from '@navikt/ds-react';

import styles from './ExpandableHistorikkContent.module.css';

interface ExpandableHistorikkContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ExpandableHistorikkContent: React.FC<ExpandableHistorikkContentProps> = ({
    className,
    children,
    ...divProps
}) => {
    const [open, setOpen] = useState(false);
    return (
        <Accordion.Item open={open} className={classNames(styles.ExpandableHistorikkContent, className)} {...divProps}>
            <Accordion.Header className={styles.Header} onClick={() => setOpen((prevState) => !prevState)}>
                {open ? 'Lukk' : 'Åpne'}
            </Accordion.Header>
            <Accordion.Content className={styles.Content}>{children}</Accordion.Content>
        </Accordion.Item>
    );
};
