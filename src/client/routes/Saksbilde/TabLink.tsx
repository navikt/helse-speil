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
        line-height: 22px;
    }

    &.hjem-ikon {
        padding-left: 2.25rem;
        background: url("data:image/svg+xml,%3Csvg width='16' height='18' viewBox='0 0 16 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 0L15.5 7.5V18H8.75V13.5H7.25V18H0.5V7.5L8 0ZM8 2.12175L2 8.121V16.5H5.75V12H10.25V16.5H14V8.12175L8 2.12175Z' fill='%233E3832'/%3E%3C/svg%3E%0A")
            no-repeat 9px center;
        &:after {
            padding-left: 0.75rem;
            transform: translateX(calc(-50% + 7px));
        }
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
    hjemIkon?: boolean;
}

export const TabLink = ({ children, to, disabled, hjemIkon = false }: TabLinkProps) =>
    disabled ? (
        <DisabledTabLink>{children}</DisabledTabLink>
    ) : (
        <StyledTabLink title={children} to={to} className={hjemIkon ? 'hjem-ikon' : ''}>
            {children}
        </StyledTabLink>
    );
