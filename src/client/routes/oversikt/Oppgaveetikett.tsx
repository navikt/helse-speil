import React, { CSSProperties } from 'react';
import styled from '@emotion/styled';
import { Periodetype } from 'internal-types';

export interface EtikettProps {
    style?: CSSProperties;
}

const Etikett = styled.div<EtikettProps>`
    width: max-content;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    ${({ style }) =>
        style &&
        `
        ${style};
    `}
`;

export const Forlengelse = styled(Etikett)`
    background: var(--speil-etikett-forlengelse-background);
    border: 1px solid var(--speil-etikett-forlengelse-border);
`;

export const Førstegangsbehandling = styled(Etikett)`
    background: var(--speil-etikett-forstegangs-background);
    border: 1px solid var(--speil-etikett-forstegangs-border);
`;

export const Infotrygdforlengelse = styled(Etikett)`
    background: var(--speil-etikett-forlengelse-it-background);
    border: 1px solid var(--speil-etikett-forlengelse-it-border);
    color: var(--navds-color-text-inverse);
`;

export const Stikkprøve = styled(Etikett)`
    background: var(--speil-etikett-stikkprove-background);
    border: 1px solid var(--speil-etikett-stikkprove-border);
    color: var(--navds-color-text-inverse);
`;

export const RiskQa = styled(Etikett)`
    background: var(--speil-etikett-risk-background);
    border: 1px solid var(--speil-etikett-risk-border);
    color: var(--navds-color-text-primary);
`;

interface OppgaveetikettProps {
    type: Periodetype;
}

export const Oppgaveetikett = ({ type }: OppgaveetikettProps) => {
    switch (type) {
        case Periodetype.Forlengelse:
        case Periodetype.Infotrygdforlengelse:
            return <Forlengelse>Forlengelse</Forlengelse>;
        case Periodetype.Førstegangsbehandling:
            return <Førstegangsbehandling>Førstegang.</Førstegangsbehandling>;
        case Periodetype.OvergangFraInfotrygd:
            return <Infotrygdforlengelse>Forlengelse - IT</Infotrygdforlengelse>;
        case Periodetype.Stikkprøve:
            return <Stikkprøve>Stikkprøve</Stikkprøve>;
        case Periodetype.RiskQa:
            return <RiskQa>Risk QA</RiskQa>;
        default:
            return null;
    }
};
