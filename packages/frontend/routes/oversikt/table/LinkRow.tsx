import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Table } from '@navikt/ds-react';

import { useLazyQuery } from '@apollo/client';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { FetchPersonDocument } from '@io/graphql';

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
    const ref = useRef<HTMLTableRowElement | null>(null);
    const doNavigate = useNavigate();
    const [hentPerson, { loading }] = useLazyQuery(FetchPersonDocument);

    useLoadingToast({ isLoading: loading, message: 'Henter person' });

    const navigate = (event: React.SyntheticEvent) => {
        if (loading) {
            return;
        }

        hentPerson({ variables: { aktorId: aktørId } }).then(() => {
            const destinationUrl = `/person/${aktørId}/forslag-til-vedtak`;
            if (shouldOpenInNewTab(event)) {
                window.open(destinationUrl, '_blank');
            } else {
                doNavigate(destinationUrl);
            }
        });
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
