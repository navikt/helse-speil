import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useLoadingToast } from '@hooks/useLoadingToast';
import { useFetchPerson } from '@state/person';

import { Row } from './Row';

const HighlightOnHoverRow = styled(Row)`
    &:hover,
    &:focus {
        background-color: var(--speil-light-hover-tabell);
        cursor: pointer;
        outline: none;
    }
`;

interface LinkRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    aktørId: string;
}

export const LinkRow = ({ aktørId, children, ...rest }: LinkRowProps) => {
    const history = useHistory();
    const fetchPerson = useFetchPerson();
    const [isFetching, setIsFetching] = useState(false);

    useLoadingToast({ isLoading: isFetching, message: 'Henter person' });

    const navigate = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (isFetching) {
            return;
        }

        const destinationUrl = `/person/${aktørId}/utbetaling`;
        const pressedModifierKey = event.ctrlKey || event.metaKey;
        const clickedMiddleMouseButton = (event as React.MouseEvent).button === 1;

        setIsFetching(true);
        fetchPerson(aktørId)
            .then(() => {
                if (pressedModifierKey || clickedMiddleMouseButton) {
                    window.open(destinationUrl, '_blank');
                } else {
                    history.push(destinationUrl);
                }
            })
            .finally(() => {
                setIsFetching(false);
            });
    };

    const onKeyPress = (event: React.KeyboardEvent) => {
        if (event.code === 'Space' || event.code === 'Enter') {
            navigate(event);
        }
    };

    return (
        <HighlightOnHoverRow role="link" tabIndex={0} onClick={navigate} onKeyPress={onKeyPress} {...rest}>
            {children}
        </HighlightOnHoverRow>
    );
};
