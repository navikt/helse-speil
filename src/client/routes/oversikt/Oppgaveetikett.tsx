import React, { CSSProperties } from 'react';
import styled from '@emotion/styled';
import { Periodetype } from 'internal-types';
import { Flex } from '../../components/Flex';

export interface EtikettProps {
    style?: CSSProperties;
    størrelse: 's' | 'l';
}

const Etikett = styled.div<EtikettProps>`
    border-radius: 0.25rem;
    ${({ style }) =>
        style &&
        `
        ${style};
    `}

    width: ${({ størrelse }) => (størrelse === 'l' ? '1.25rem' : '1rem')};
    height: ${({ størrelse }) => (størrelse === 'l' ? '1.25rem' : '1rem')};
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0.5rem;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    margin-right: 0.5rem;
`;

export const ForlengelseEtikett = styled(Etikett)`
    background: var(--speil-etikett-forlengelse-background);
    border: 1px solid var(--speil-etikett-forlengelse-border);
`;

export const FørstegangsbehandlingEtikett = styled(Etikett)`
    background: var(--speil-etikett-forstegangs-background);
    border: 1px solid var(--speil-etikett-forstegangs-border);
`;

export const InfotrygdforlengelseEtikett = styled(Etikett)`
    background: var(--speil-etikett-forlengelse-it-background);
    border: 1px solid var(--speil-etikett-forlengelse-it-border);
    color: var(--navds-color-text-inverse);
`;

export const StikkprøveEtikett = styled(Etikett)`
    background: var(--speil-etikett-stikkprove-background);
    border: 1px solid var(--speil-etikett-stikkprove-border);
    color: var(--navds-color-text-inverse);
`;

export const RiskQaEtikett = styled(Etikett)`
    background: var(--speil-etikett-risk-background);
    border: 1px solid var(--speil-etikett-risk-border);
    color: var(--navds-color-text-primary);
`;

interface OppgaveetikettProps {
    type: Periodetype;
    medLabel?: boolean;
    størrelse?: 's' | 'l';
    style?: CSSProperties;
}

export const Oppgaveetikett = ({ type, størrelse = 'l', medLabel = false, style }: OppgaveetikettProps) => {
    switch (type) {
        case Periodetype.Forlengelse:
        case Periodetype.Infotrygdforlengelse:
            return (
                <Flex alignItems={'center'}>
                    <ForlengelseEtikett størrelse={størrelse} style={style}>
                        FL
                    </ForlengelseEtikett>
                    {medLabel && 'Forlengelse'}
                </Flex>
            );
        case Periodetype.Førstegangsbehandling:
            return (
                <Flex alignItems={'center'}>
                    <FørstegangsbehandlingEtikett størrelse={størrelse} style={style}>
                        F
                    </FørstegangsbehandlingEtikett>
                    {medLabel && 'Førstegang.'}
                </Flex>
            );
        case Periodetype.OvergangFraInfotrygd:
            return (
                <Flex alignItems={'center'}>
                    <InfotrygdforlengelseEtikett størrelse={størrelse} style={style}>
                        FI
                    </InfotrygdforlengelseEtikett>
                    {medLabel && 'Forlengelse IT'}
                </Flex>
            );
        case Periodetype.Stikkprøve:
            return (
                <Flex alignItems={'center'}>
                    <StikkprøveEtikett størrelse={størrelse} style={style}>
                        S
                    </StikkprøveEtikett>
                    {medLabel && 'Stikkprøve'}
                </Flex>
            );
        case Periodetype.RiskQa:
            return (
                <Flex alignItems={'center'}>
                    <RiskQaEtikett størrelse={størrelse} style={style}>
                        QA
                    </RiskQaEtikett>
                    {medLabel && 'Risk QA'}
                </Flex>
            );
        default:
            return null;
    }
};
