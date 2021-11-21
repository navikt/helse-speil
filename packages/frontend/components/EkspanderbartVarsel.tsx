import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { ReactNode, useState } from 'react';

import { Accordion, Alert } from '@navikt/ds-react';

const Container = styled(Accordion.Item)<{ type: string }>`
    > button {
        color: var(--navds-color-text-primary);
        background-color: var(--navds-color-warning-background);
        padding: 0 1rem 0 0;

        &,
        &:hover,
        &:focus {
            border-bottom: 1px solid var(--navds-color-warning-border);
        }

        &.navds-accordion__header:hover {
            text-decoration-color: var(--navds-color-text-primary);
        }

        &:focus,
        &:active {
            box-shadow: none;
        }

        &:focus-visible {
            box-shadow: inset var(--navds-shadow-focus);
        }

        > svg > path {
            fill: var(--navds-color-text-primary);
        }

        .navds-alert {
            border-radius: 0;
            border: none;
            font-size: 1rem;
            font-weight: 400;
            color: var(--navds-color-text-primary);
            padding: 0.5rem 1rem;
            min-height: unset;
        }
        ${(props) =>
            css`
                background-color: var(--navds-color-${props.type}-background);

                &,
                &:hover,
                &:focus {
                    border-bottom: 1px solid var(--navds-color-${props.type}-border);
                }
            `};
    }
`;

const Content = styled(Accordion.Content)<{ type: string }>`
    background-color: var(--speil-ekspandert-warning-background);
    padding: 0.5rem 3.25rem;
    border-bottom: 1px solid var(--navds-color-warning-border);
    ${(props) =>
        css`
            background-color: var(--speil-ekspandert-${props.type}-background);
            border: 1px solid var(--navds-color-${props.type}-border);
        `};
`;

interface EkspanderbartVarselProps {
    label: ReactNode;
    children: ReactNode;
    type?: 'error' | 'warning' | 'info' | 'success';
}

export const EkspanderbartVarsel: React.FC<EkspanderbartVarselProps> = ({ label, children, type = 'warning' }) => {
    const [open, setOpen] = useState(false);

    const heading = <Alert variant={type ?? 'warning'}>{label}</Alert>;

    return (
        <Container defaultOpen={open} type={type ?? 'warning'}>
            <Accordion.Header onClick={() => setOpen(!open)}>{heading}</Accordion.Header>
            <Content type={type ?? 'warning'}>{children}</Content>
        </Container>
    );
};
