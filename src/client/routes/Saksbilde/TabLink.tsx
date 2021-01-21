import React, { ReactNode } from 'react';
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

const Content = styled.span`
    color: transparent;
    position: relative;

    &:after {
        content: attr(title);
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        color: #3e3832;
        line-height: 22px;
    }
`;

const StyledTabLink = styled(NavLink)`
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 10px;
    margin: 0 4px;
    outline: none;
    line-height: 22px;
    text-decoration: none;

    &.active,
    &:hover {
        > .content:after {
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

const IconContainer = styled.span`
    margin-right: 0.5rem;
`;

interface TabLinkProps {
    children: ReactNode;
    to?: string;
    title?: string;
    disabled?: boolean;
    icon?: ReactNode;
}

export const TabLink = ({ children, to, disabled, title, icon }: TabLinkProps) =>
    disabled || !to ? (
        <DisabledTabLink>
            {icon && <IconContainer>{icon}</IconContainer>}
            <Content>{children}</Content>
        </DisabledTabLink>
    ) : (
        <StyledTabLink role="tab" to={to}>
            {icon && <IconContainer>{icon}</IconContainer>}
            <Content className="content" title={title}>
                {children}
            </Content>
        </StyledTabLink>
    );
