import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Infoikon } from './ikoner/Infoikon';
import { GrøntSjekkikon } from './ikoner/GrøntSjekkikon';
import { Advarselikon } from './ikoner/Advarselikon';
import { Feilikon } from './ikoner/Feilikon';

declare type VarselVariant = 'info' | 'suksess' | 'advarsel' | 'feil';

const Container = styled.div<{ variant: VarselVariant }>`
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
            case 'suksess':
                return css`
                    background-color: var(--navds-alert-color-success-background);
                    border-color: var(--navds-alert-color-success-border);
                `;
            case 'advarsel':
                return css`
                    background-color: var(--navds-alert-color-warning-background);
                    border-color: var(--navds-alert-color-warning-border);
                `;
            case 'feil':
                return css`
                    background-color: var(--navds-alert-color-error-background);
                    border-color: var(--navds-alert-color-error-border);
                `;
        }
    }}
`;

interface VarselProps extends React.HTMLAttributes<HTMLDivElement> {
    variant: VarselVariant;
}

export const Varsel: React.FC<VarselProps> = ({ variant, children, ...divProps }) => (
    <Container variant={variant} {...divProps}>
        {variant === 'info' && <Infoikon />}
        {variant === 'suksess' && <GrøntSjekkikon />}
        {variant === 'advarsel' && <Advarselikon />}
        {variant === 'feil' && <Feilikon />}
        {children}
    </Container>
);
