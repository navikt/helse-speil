import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useLoadingToast } from '@hooks/useLoadingToast';
import { useFetchPerson } from '@state/person';

import { Row } from './Row';

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
    const ref = useRef<HTMLTableRowElement>(null);
    const history = useHistory();
    const fetchPerson = useFetchPerson();
    const [isFetching, setIsFetching] = useState(false);

    useLoadingToast({ isLoading: isFetching, message: 'Henter person' });

    const navigate = (event: React.SyntheticEvent) => {
        if (isFetching) {
            return;
        }

        setIsFetching(true);
        fetchPerson(aktørId)
            .then(() => {
                const destinationUrl = `/person/${aktørId}/utbetaling`;
                if (shouldOpenInNewTab(event)) {
                    window.open(destinationUrl, '_blank');
                } else {
                    history.push(destinationUrl);
                }
            })
            .finally(() => {
                setIsFetching(false);
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
        <Row
            className={styles.LinkRow}
            ref={ref}
            role="link"
            tabIndex={0}
            onClick={navigate}
            onKeyDown={onKeyDown}
            {...rest}
        >
            {children}
        </Row>
    );
};
