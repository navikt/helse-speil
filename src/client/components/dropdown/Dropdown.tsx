import React, {HTMLAttributes, useRef, useState} from 'react';
import styled from '@emotion/styled';
import {useInteractOutside} from '../../hooks/useInteractOutside';
import {Button} from '../Button';
import NavFrontendChevron from 'nav-frontend-chevron';
import classNames from "classnames";
import {Knapp} from "nav-frontend-knapper";

const Container = styled.span`
    position: relative;
`;

const EnkelKnapp = styled(Button)`
    display: flex;
    align-items: center;
    color: var(--navds-color-action-default);
    font-size: 1rem;
    font-weight: 600;
    padding: 0.5rem 0;

    span {
        margin-left: 0.5rem;
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
    }

    &:disabled {
        color: var(--navds-color-text-disabled);

        &:hover {
            background: inherit;
            cursor: not-allowed;
        }
    }
`;
export const Strek = styled.hr`
    border: none;
    border-top: 1px solid var(--navds-color-border);
`;

interface ListeProps {
    orientering: 'høyre' | 'venstre' | 'midtstilt';
}

const Liste = styled.ul<ListeProps>`
    position: absolute;
    list-style: none;
    background: var(--navds-color-background);
    border-radius: 0.25rem;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
    min-width: 1rem;
    min-height: 1rem;
    z-index: 1000;
    padding: 0.5rem 0;
    ${(props) => (
        props.orientering === 'venstre'
        ? 'right: 0;'
        : props.orientering === 'høyre'
        ? 'left: 0;'
        : 'left:50%; transform: translateX(-50%);'
    )}
`;

interface DropdownProps extends HTMLAttributes<HTMLButtonElement> {
    onClick?: (event: React.MouseEvent) => void;
    orientering?: 'høyre' | 'venstre' | 'midtstilt';
    labelRenderer?: (ekspandert: boolean, onClick: (event: React.MouseEvent) => void) => JSX.Element;
}

interface DropdownContextValue {
    lukk: () => void;
}

export const DropdownContext = React.createContext<DropdownContextValue>({
    lukk: () => {},
});

export const Dropdown: React.FC<DropdownProps> = (
    {
        className,
        onClick,
        children,
        orientering = 'midtstilt',
        labelRenderer = (ekspandert, onClickWrapper) =>
            <EnkelKnapp onClick={onClickWrapper}>
                {'Meny'}{<NavFrontendChevron type={ekspandert ? 'opp' : 'ned'}/>}
            </EnkelKnapp>
    }
) => {

    const [ekspandert, setEkspandert] = useState(false);
    const containerRef = useRef<HTMLSpanElement>(null);

    useInteractOutside({
        ref: containerRef,
        active: ekspandert,
        onInteractOutside: () => setEkspandert(false),
    });

    const onClickWrapper = (event: React.MouseEvent) => {
        onClick?.(event);
        setEkspandert(!ekspandert);
    };

    const lukk = () => {
        setEkspandert(false);
    };

    return (
        <Container ref={containerRef} className={classNames(className)}>
            {labelRenderer(ekspandert, onClickWrapper)}
            <DropdownContext.Provider value={{lukk}}>
                {ekspandert && <Liste orientering={orientering}>{children}</Liste>}
            </DropdownContext.Provider>
        </Container>
    );
};