import React, { PropsWithChildren } from 'react';
import styled from '@emotion/styled';
import { LinkProps, NavLink } from 'react-router-dom';

const InaktivNavLink = styled.a`
    text-decoration: none;
    color: #b5b5b5;
    padding: 0.5rem 3rem 0.5rem 2rem;
`;

const AktivNavLink = styled(NavLink)`
    text-decoration: none;
    color: #3e3832;
    padding: 0.5rem 3rem 0.5rem 2rem;

    &:hover,
    &.active {
        background: #e7e9e9;
    }

    &.active {
        box-shadow: inset 0.35rem 0 0 0 #0067c5;
    }

    &:focus {
        box-shadow: 0 0 0 3px #254b6d;
        outline: none;
        z-index: 1000;
    }
`;

export const InaktivLenke = ({ children, className, ...rest }: PropsWithChildren<any>) => (
    <InaktivNavLink className={className} {...rest}>
        {children}
    </InaktivNavLink>
);

export const AktivLenke = ({ to, className, children, id }: PropsWithChildren<LinkProps>) => {
    const blurElement = (event: React.MouseEvent) => (event.target as HTMLElement).blur();
    return (
        <AktivNavLink id={id} to={to} tabIndex={0} onClick={blurElement} className={className}>
            {children}
        </AktivNavLink>
    );
};
