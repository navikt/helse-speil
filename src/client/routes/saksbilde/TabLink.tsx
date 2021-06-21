import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { ReactNode } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { TabButton } from '../../components/TabButton';

const Content = styled.span`
    color: transparent;
    position: relative;

    &:after {
        content: attr(title);
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        color: var(--navds-color-text-primary);
    }
`;

const DisabledTabLink = styled(TabButton)`
    height: 48px;
    color: var(--navds-color-text-disabled);
`;

const TabLinkButton = styled(TabButton)`
    height: 48px;

    ${(props) =>
        props.active &&
        css`
            > span:after {
                font-weight: 600;
            }
        `}
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

export const TabLink = ({ children, to, disabled, title, icon }: TabLinkProps) => {
    const location = useLocation();
    const history = useHistory();

    return disabled || !to ? (
        <DisabledTabLink disabled>
            {icon && <IconContainer>{icon}</IconContainer>}
            <Content title={title}>{children}</Content>
        </DisabledTabLink>
    ) : (
        <TabLinkButton role="link" data-href={to} onClick={() => history.push(to)} active={location.pathname === to}>
            {icon && <IconContainer>{icon}</IconContainer>}
            <Content className="content" title={title}>
                {children}
            </Content>
        </TabLinkButton>
    );
};
