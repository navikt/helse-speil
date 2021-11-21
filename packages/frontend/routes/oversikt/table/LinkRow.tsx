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

    const navigate = (event: React.KeyboardEvent | React.MouseEvent) => {
        onNavigate?.();
        const destinationUrl = `/person/${aktørId}/utbetaling`;
        const pressedModifierKey = event.ctrlKey || event.metaKey;
        const clickedMiddleMouseButton = (event as React.MouseEvent).button === 1;

        if (pressedModifierKey || clickedMiddleMouseButton) {
            window.open(destinationUrl, '_blank');
        } else {
            history.push(destinationUrl);
        }
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
