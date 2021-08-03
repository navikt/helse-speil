import styled from '@emotion/styled';
import React, { HTMLAttributes, useState } from 'react';

import NavFrontendChevron from 'nav-frontend-chevron';
import { Knapp } from 'nav-frontend-knapper';

import { Popover } from '@navikt/ds-react';

import { Button } from '../Button';

const Container = styled.div`
    > .navds-popover {
        padding: 16px 0;
        border-radius: 4px;

        &:focus,
        &:focus-visible {
            box-shadow: 0 0.05rem 0.25rem 0.125rem rgb(0 0 0 / 8%);
            border-color: var(--navds-text-focus);
        }
    }
`;

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
    height: 32px;
    min-width: 180px;
    font-size: 1rem;
    white-space: nowrap;
    text-align: left;
    padding: 0 16px;
    width: 100%;
    box-sizing: border-box;

    &:hover,
    &:focus {
        background: var(--navds-color-blue-10);
        color: var(--navds-primary-text);
        cursor: pointer;
    }

    &:focus-visible,
    &:focus {
        box-shadow: inset 0 0 0 2px var(--navds-text-focus);
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
    padding: 0;
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
    orientering?: 'bottom-start';
}

export const Dropdown: React.FC<DropdownProps> = ({ className, onClick, children, orientering = 'bottom-start' }) => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const onClickWrapper = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onClick?.(event);
        anchor ? setAnchor(null) : setAnchor(event.currentTarget);
    };

    const lukk = () => {
        setAnchor(null);
    };

    return (
        <Container>
            <ToggleMenuButton onClick={onClickWrapper} className={className}>
                Meny
                <NavFrontendChevron type={anchor !== null ? 'opp' : 'ned'} />
            </ToggleMenuButton>
            <Popover
                open={anchor !== null}
                tabIndex={-1}
                placement={orientering}
                arrow={false}
                anchorEl={anchor}
                onClose={lukk}
                offset={0}
            >
                <Liste>{children}</Liste>
            </Popover>
        </Container>
    );
};
