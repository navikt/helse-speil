import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Infoikon } from './ikoner/Infoikon';
import { GrøntSjekkikon } from './ikoner/GrøntSjekkikon';
import { Advarselikon } from './ikoner/Advarselikon';
import { Feilikon } from './ikoner/Feilikon';
import { SpeilError } from '@utils/error';

const Container = styled.div<{ variant: SpeilError['severity'] }>`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    border-width: 1px;
    border-style: solid;
    height: max-content;
    ${(props) => {
        switch (props.variant) {
            case 'info':
                return css`
                    background-color: var(--navds-alert-color-info-background);
                    border-color: var(--navds-alert-color-info-border);
                `;
            case 'success':
                return css`
                    background-color: var(--navds-alert-color-success-background);
                    border-color: var(--navds-alert-color-success-border);
                `;
            case 'warning':
                return css`
                    background-color: var(--navds-alert-color-warning-background);
                    border-color: var(--navds-alert-color-warning-border);
                `;
            case 'error':
                return css`
                    background-color: var(--navds-alert-color-error-background);
                    border-color: var(--navds-alert-color-error-border);
                `;
        }
    }}
`;

interface VarselProps extends React.HTMLAttributes<HTMLDivElement> {
    variant: SpeilError['severity'];
}

export const Varsel: React.FC<VarselProps> = ({ variant, children, ...divProps }) => (
    <Container variant={variant} {...divProps}>
        {variant === 'info' && <Infoikon />}
        {variant === 'success' && <GrøntSjekkikon />}
        {variant === 'warning' && <Advarselikon />}
        {variant === 'error' && <Feilikon />}
        {children}
    </Container>
);
