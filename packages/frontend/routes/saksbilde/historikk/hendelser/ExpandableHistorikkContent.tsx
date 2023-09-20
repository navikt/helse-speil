import classNames from 'classnames';
import React, { useState } from 'react';

import { Accordion } from '@navikt/ds-react';

import styles from './ExpandableHistorikkContent.module.css';

interface ExpandableHistorikkContentProps extends React.HTMLAttributes<HTMLDivElement> {
    openText?: string;
    closeText?: string;
}

export const ExpandableHistorikkContent: React.FC<ExpandableHistorikkContentProps> = ({
    className,
    children,
    openText = 'Åpne',
    closeText = 'Lukk',
    ...divProps
}) => {
    const [open, setOpen] = useState(false);
    return (
        <Accordion.Item open={open} className={classNames(className)} {...divProps}>
            <Accordion.Header className={styles.Header} onClick={() => setOpen((prevState) => !prevState)}>
                {open ? closeText : openText}
            </Accordion.Header>
            <Accordion.Content style={{ minWidth: '200px' }} className={styles.Content}>
                {children}
            </Accordion.Content>
        </Accordion.Item>
    );
};
