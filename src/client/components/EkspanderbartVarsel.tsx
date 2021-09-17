import styled from '@emotion/styled';
import React, { ReactNode, useState } from 'react';

import { Accordion, Alert } from '@navikt/ds-react';

const Container = styled(Accordion)`
    border-bottom: 1px solid var(--navds-color-warning-border);

    &:hover {
        border-bottom: 1px solid var(--navds-color-warning-border);
    }

    > button {
        &:hover > .navds-accordion__heading {
            color: var(--navds-color-text-primary);
        }

        &:focus,
        &:active {
            box-shadow: none;
        }

        &:focus-visible {
            box-shadow: inset var(--navds-shadow-focus);
        }

        background-color: var(--navds-color-warning-background);
        padding: 0 1rem 0 0;

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
    }

    .navds-accordion__content {
        padding: 0;
    }
`;

const Content = styled.div`
    background: var(--navds-color-warning-background);
    padding: 0.5rem 3.25rem;
`;

const Warning = styled(Alert)`
    background: none;
`;

interface EkspanderbartVarselProps {
    label: ReactNode;
    children: ReactNode;
    type?: 'error' | 'warning' | 'info' | 'success';
}

export const EkspanderbartVarsel: React.FC<EkspanderbartVarselProps> = ({ label, children, type = 'warning' }) => {
    const [open, setOpen] = useState(false);

    const heading = <Warning variant="warning">{label}</Warning>;

    return (
        <Container heading={heading} open={open} onClick={() => setOpen(!open)}>
            <Content>{children}</Content>
        </Container>
    );
};
