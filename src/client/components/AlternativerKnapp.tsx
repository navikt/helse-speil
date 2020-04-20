import React, { ReactNode, useRef, useState } from 'react';
import classNames from 'classnames';
import styled from '@emotion/styled';
import { useClickOutside } from '../hooks/useClickOutside';
import { useFocusOutside } from '../hooks/useFocusOutside';

interface AlternativerKnappProps {
    onClick?: (event: React.MouseEvent) => void;
    children?: ReactNode | ReactNode[];
    className?: string;
}

const Container = styled.span`
    position: relative;
`;

const Knapp = styled.button`
    background: transparent;
    outline: none;
    border: none;
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 3px;
    border-radius: 50%;
    transition: all 0.1s ease;
    cursor: pointer;

    &:hover,
    &:focus {
        background: #e7e9e9;
        box-shadow: 0 0 0 3px #e7e9e9;
    }
`;

const Alternativer = styled.ul`
    position: absolute;
    list-style: none;
    background: #ffffff;
    border-radius: 0.25rem;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
    min-width: 1rem;
    min-height: 1rem;
`;

const AlternativerKnapp = ({ onClick, className, children }: AlternativerKnappProps) => {
    const [ekspandert, setEkspandert] = useState(false);
    const containerRef = useRef<HTMLSpanElement>(null);
    const knappRef = useRef<HTMLButtonElement>(null);

    useFocusOutside({
        ref: containerRef,
        active: ekspandert,
        onFocusOutside: () => setEkspandert(e => !e)
    });

    useClickOutside({
        ref: knappRef,
        active: ekspandert,
        onClickOutside: () => setEkspandert(e => !e)
    });

    const onClickWrapper = (event: React.MouseEvent) => {
        onClick?.(event);
        setEkspandert(!ekspandert);
    };

    return (
        <Container ref={containerRef}>
            <Knapp ref={knappRef} onClick={onClickWrapper} className={classNames(className)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
            </Knapp>
            {ekspandert && <Alternativer>{children}</Alternativer>}
        </Container>
    );
};

export default AlternativerKnapp;
