import styled from '@emotion/styled';
import React from 'react';

import { IconLocked } from './IconLocked';
import { IconOpen } from './IconOpen';

const RedigerKnapp = styled.button`
    border: none;
    background: none;
    display: flex;
    align-items: flex-end;
    outline: none;
    cursor: pointer;
    color: var(--navds-color-action-default);
    font-size: 1rem;
    font-family: inherit;

    > svg {
        margin-right: 0.25rem;
    }

    &:focus,
    &:hover {
        text-decoration: underline;
    }
`;

interface OverstyringsknappProps extends React.HTMLAttributes<HTMLButtonElement> {
    overstyrer: boolean;
    toggleOverstyring: () => void;
}

export const Overstyringsknapp = ({ overstyrer, toggleOverstyring, children, ...rest }: OverstyringsknappProps) => (
    <RedigerKnapp type="button" onClick={toggleOverstyring} {...rest}>
        {overstyrer ? (
            <>
                <IconOpen />
                Avbryt
            </>
        ) : (
            <>
                <IconLocked />
                {children}
            </>
        )}
    </RedigerKnapp>
);
