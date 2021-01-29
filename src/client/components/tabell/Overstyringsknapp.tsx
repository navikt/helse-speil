import React from 'react';
import { IkonÅpenLås } from './ikoner/IkonÅpenLås';
import { IkonLukketLås } from './ikoner/IkonLukketLås';
import styled from '@emotion/styled';

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

interface OverstyringsknappProps {
    overstyrer: boolean;
    toggleOverstyring: () => void;
}

export const Overstyringsknapp = ({ overstyrer, toggleOverstyring }: OverstyringsknappProps) => (
    <RedigerKnapp type="button" onClick={toggleOverstyring}>
        {overstyrer ? (
            <>
                <IkonÅpenLås />
                Avbryt
            </>
        ) : (
            <>
                <IkonLukketLås />
                Endre
            </>
        )}
    </RedigerKnapp>
);
