import React, { HTMLAttributes, useRef, useState } from 'react';
import classNames from 'classnames';
import styled from '@emotion/styled';
import { useInteractOutside } from '../hooks/useInteractOutside';
import { Button } from './Button';

const Container = styled.span`
    position: relative;
`;

const Knapp = styled(Button)`
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 3px;
    border-radius: 50%;

    &:hover,
    &:focus {
        background: #e7e9e9;
        box-shadow: 0 0 0 3px #e7e9e9;
    }
`;

const Liste = styled.ul`
    position: absolute;
    list-style: none;
    background: #ffffff;
    border-radius: 0.25rem;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
    min-width: 1rem;
    min-height: 1rem;
    z-index: 1000;
    padding: 0.5rem 0;
`;

const OptionsIkon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="m4 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm16 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-8 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
);

interface DropdownProps extends HTMLAttributes<HTMLButtonElement> {
    onClick?: (event: React.MouseEvent) => void;
}

interface DropdownContextValue {
    lukk: () => void;
}

export const DropdownContext = React.createContext<DropdownContextValue>({
    lukk: () => {},
});

export const Dropdown: React.FC<DropdownProps> = ({ onClick, className, children }) => {
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
        <Container ref={containerRef}>
            <Knapp onClick={onClickWrapper} className={classNames(className)}>
                <OptionsIkon />
            </Knapp>
            <DropdownContext.Provider value={{ lukk }}>
                {ekspandert && <Liste>{children}</Liste>}
            </DropdownContext.Provider>
        </Container>
    );
};
