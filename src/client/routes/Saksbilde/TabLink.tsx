import React from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

const DisabledTabLink = styled.a`
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 10px;
    margin: 0 4px;
    color: #78706a;
    outline: none;
`;

const StyledTabLink = styled(NavLink)`
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 10px;
    margin: 0 4px;
    color: transparent;
    outline: none;

    &:nth-of-type(1) {
        margin-left: 0;
    }

    &:after {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        content: attr(title);
        color: #3e3832;
    }

    &.active,
    &:hover {
        &:after {
            font-weight: 600;
        }

        &:before {
            position: absolute;
            content: '';
            height: 4px;
            width: 100%;
            background: #0067c5;
            bottom: 0;
            left: 0;
            border-top-left-radius: 2px;
            border-top-right-radius: 2px;
        }
    }

    &:focus-visible {
        box-shadow: inset 0 0 0 3px #254b6d;
    }
`;

interface TabLinkProps {
    children: string;
    to: string;
    disabled?: boolean;
}

export const TabLink = ({ children, to, disabled }: TabLinkProps) =>
    disabled ? (
        <DisabledTabLink>{children}</DisabledTabLink>
    ) : (
        <StyledTabLink title={children} to={to}>
            {children}
        </StyledTabLink>
    );
