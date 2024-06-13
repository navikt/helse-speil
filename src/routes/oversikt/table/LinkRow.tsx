import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';

import { Table } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';

import styles from './LinkRow.module.css';

const shouldOpenInNewTab = (event: React.SyntheticEvent): boolean => {
    return (
        (event as React.KeyboardEvent).ctrlKey ||
        (event as React.KeyboardEvent).metaKey ||
        (event as React.MouseEvent).button === 1
    );
};

interface LinkRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    aktørId: string;
}

export const LinkRow = ({ aktørId, children, ...rest }: LinkRowProps) => {
    const ref = useRef<Maybe<HTMLTableRowElement>>(null);
    const router = useRouter();

    const navigate = (event: React.SyntheticEvent) => {
        const destinationUrl = `/person/${aktørId}/dagoversikt`;
        if (shouldOpenInNewTab(event)) {
            window.open(destinationUrl, '_blank');
        } else {
            router.push(destinationUrl);
        }
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.target !== ref.current) {
            return false;
        }
        if (event.code === 'Space' || event.code === 'Enter') {
            return navigate(event);
        }
    };

    return (
        <Table.Row
            className={styles.LinkRow}
            ref={ref}
            role="link"
            tabIndex={0}
            onClick={navigate}
            onKeyDown={onKeyDown}
            {...rest}
        >
            {children}
        </Table.Row>
    );
};
