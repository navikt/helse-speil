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

interface OverstyringsknappProps {
    overstyrer: boolean;
    overstyringsknappTekst?: string;
    toggleOverstyring: () => void;
}

export const Overstyringsknapp = ({
    overstyrer,
    toggleOverstyring,
    overstyringsknappTekst = 'Endre',
}: OverstyringsknappProps) => (
    <RedigerKnapp type="button" onClick={toggleOverstyring}>
        {overstyrer ? (
            <>
                <IconOpen />
                Avbryt
            </>
        ) : (
            <>
                <IconLocked />
                {overstyringsknappTekst}
            </>
        )}
    </RedigerKnapp>
);
