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
    <svg width="20" height="6" viewBox="0 0 20 5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.53333 4.75C3.93245 4.75 5.06667 3.68668 5.06667 2.375C5.06667 1.06332 3.93245 0 2.53333 0C1.13421 0 0 1.06332 0 2.375C0 3.68668 1.13421 4.75 2.53333 4.75Z"
            fill="#3E3832"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 4.75C11.3991 4.75 12.5333 3.68668 12.5333 2.375C12.5333 1.06332 11.3991 0 10 0C8.60089 0 7.46667 1.06332 7.46667 2.375C7.46667 3.68668 8.60089 4.75 10 4.75Z"
            fill="#3E3832"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.4667 4.75C18.8658 4.75 20 3.68668 20 2.375C20 1.06332 18.8658 0 17.4667 0C16.0676 0 14.9333 1.06332 14.9333 2.375C14.9333 3.68668 16.0676 4.75 17.4667 4.75Z"
            fill="#3E3832"
        />
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
