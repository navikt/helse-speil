import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { Accordion } from '@navikt/ds-react';

import styles from './ExpandableSkjønnsfastsettingBegrunnelse.module.css';

interface ExpandableSkjønnsfastsettingBegrunnelseProps extends React.HTMLAttributes<HTMLDivElement> {
    openText?: string;
    closeText?: string;
    onOpen?: (open: boolean) => void;
}

export const ExpandableSkjønnsfastsettingBegrunnelseContent = ({
    className,
    children,
    openText = 'Vis mer',
    closeText = 'Vis mindre',
    onOpen = () => {},
    ...divProps
}: ExpandableSkjønnsfastsettingBegrunnelseProps): ReactElement => {
    const [open, setOpen] = useState(false);
    return (
        <Accordion>
            <Accordion.Item open={open} className={classNames(styles.item, className)} {...divProps}>
                <Accordion.Content className={styles.content}>{children}</Accordion.Content>
                {!open && (
                    <Accordion.Item className={classNames(styles.content, styles.closed)}>{children}</Accordion.Item>
                )}
                <Accordion.Header
                    className={styles.header}
                    onClick={() => {
                        setOpen((prevState) => !prevState);
                        onOpen(!open);
                    }}
                >
                    {open ? closeText : openText}
                </Accordion.Header>
            </Accordion.Item>
        </Accordion>
    );
};
