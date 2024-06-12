import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { Accordion } from '@navikt/ds-react';

import styles from './ExpandableHistorikkContent.module.css';

interface ExpandableHistorikkContentProps extends React.HTMLAttributes<HTMLDivElement> {
    openText?: string;
    closeText?: string;
    onOpen?: (open: boolean) => void;
}

export const ExpandableHistorikkContent = ({
    className,
    children,
    openText = 'Åpne',
    closeText = 'Lukk',
    onOpen = () => {},
    ...divProps
}: ExpandableHistorikkContentProps): ReactElement => {
    const [open, setOpen] = useState(false);
    return (
        <Accordion>
            <Accordion.Item open={open} className={classNames(styles.item, className)} {...divProps}>
                <Accordion.Header
                    className={styles.Header}
                    onClick={() => {
                        setOpen((prevState) => !prevState);
                        onOpen(!open);
                    }}
                >
                    {open ? closeText : openText}
                </Accordion.Header>
                <Accordion.Content style={{ minWidth: '200px' }} className={styles.Content}>
                    {children}
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};
