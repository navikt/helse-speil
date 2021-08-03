import styled from '@emotion/styled';
import React, { HTMLAttributes, useState } from 'react';

import NavFrontendChevron from 'nav-frontend-chevron';
import { Knapp } from 'nav-frontend-knapper';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';

import { Button } from '../Button';

const ToggleMenuButton = styled(Button)`
    display: flex;
    align-items: center;
    color: var(--navds-color-action-default);
    font-size: 1rem;
    font-weight: 600;
    padding: 8px 12px;

    span {
        margin-left: 0.5rem;
    }

    &:focus-visible {
        box-shadow: inset var(--navds-shadow-focus);
    }
`;

export const DropdownMenyknapp = styled(Knapp)`
    all: unset;
    height: 30px;
    min-width: 180px;
    font-size: 1rem;
    white-space: nowrap;
    text-align: left;
    padding: 0.25rem 1rem;
    width: 100%;
    box-sizing: border-box;

    &:hover,
    &:focus {
        background: var(--speil-light-hover);
        color: var(--navds-primary-text);
        cursor: pointer;
    }

    &:disabled {
        &,
        &:hover {
            background-color: transparent;
            color: var(--navds-color-text-disabled);
        }
    }
`;

const Liste = styled.ul`
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0.5rem 0;
    background: var(--navds-color-background);
`;

interface DropdownContextValue {
    lukk: () => void;
}

export const DropdownContext = React.createContext<DropdownContextValue>({
    lukk: () => {},
});

interface DropdownProps extends HTMLAttributes<HTMLButtonElement> {
    onClick?: (event: React.MouseEvent) => void;
    orientering?: PopoverOrientering;
}

export const Dropdown: React.FC<DropdownProps> = ({
    className,
    onClick,
    children,
    orientering = PopoverOrientering.UnderHoyre,
}) => {
    const [anchor, setAnchor] = useState<HTMLElement | undefined>(undefined);

    const onClickWrapper = (event: React.MouseEvent<HTMLElement>) => {
        onClick?.(event);
        setAnchor((anchor) => (anchor ? undefined : event.currentTarget));
    };

    const lukk = () => {
        setAnchor(undefined);
    };

    return (
        <>
            <ToggleMenuButton onClick={onClickWrapper} className={className}>
                Meny
                <NavFrontendChevron type={anchor !== undefined ? 'opp' : 'ned'} />
            </ToggleMenuButton>
            <Popover
                tabIndex={-1}
                orientering={orientering}
                utenPil
                ankerEl={anchor}
                autoFokus={false}
                onRequestClose={lukk}
                avstandTilAnker={3}
            >
                <Liste>{children}</Liste>
            </Popover>
        </>
    );
};
