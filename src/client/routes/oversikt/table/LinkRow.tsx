import styled from '@emotion/styled';
import React from 'react';
import { useHistory } from 'react-router-dom';

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
    onNavigate?: () => void;
}

export const LinkRow = ({ aktørId, onNavigate, children, ...rest }: LinkRowProps) => {
    const history = useHistory();

    const navigate = () => {
        onNavigate?.();
        history.push(`/person/${aktørId}/utbetaling`);
    };

    const onKeyPress = (event: React.KeyboardEvent) => {
        if (event.code === 'Space' || event.code === 'Enter') {
            navigate();
        }
    };

    return (
        <HighlightOnHoverRow role="link" tabIndex={0} onClick={navigate} onKeyPress={onKeyPress} {...rest}>
            {children}
        </HighlightOnHoverRow>
    );
};
