import styled from '@emotion/styled';
import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

const DisabledTabLink = styled.a`
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 10px;
    margin: 0 4px;
    color: var(--navds-color-text-disabled);
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
        color: var(--navds-color-text-primary);
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
            background: var(--navds-color-action-default);
            bottom: 0;
            left: 0;
            border-top-left-radius: 2px;
            border-top-right-radius: 2px;
        }
    }

    &:focus-visible {
        box-shadow: inset 0 0 0 3px var(--navds-text-focus);
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
