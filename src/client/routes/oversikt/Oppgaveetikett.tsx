import React, { CSSProperties, ReactNode } from 'react';
import styled from '@emotion/styled';
import { Periodetype } from 'internal-types';
import { Flex } from '../../components/Flex';
import classNames from 'classnames';

export interface EtikettProps {
    iconLabel?: string;
    medLabel?: boolean;
    label?: ReactNode;
    størrelse?: 's' | 'l' | number;
    style?: CSSProperties;
    className?: string;
}

const Etikett = ({ iconLabel, label, størrelse, style, className }: EtikettProps) => {
    const Etikett = styled.div<{ størrelse?: 's' | 'l' | number; className?: string }>`
        border-radius: 0.25rem;
        width: ${({ størrelse = 'l' }) =>
            størrelse === 'l' ? '1.25rem' : størrelse === 's' ? '1rem' : `${størrelse}rem`};
        height: ${({ størrelse = 'l' }) =>
            størrelse === 'l' ? '1.25rem' : størrelse === 's' ? '1rem' : `${størrelse}rem`};
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

    return (
        <Flex alignItems={'center'}>
            <Etikett størrelse={størrelse} style={style} className={classNames(className)}>
                {iconLabel}
            </Etikett>
            {label}
        </Flex>
    );
};

const StyledRevurderingEtikett = styled(Etikett)`
    background: var(--nav-lime-gronn-lighten-80);
    border: 1px solid var(--nav-lime-gronn-darken-40);
`;

const StyledForlengelseEtikett = styled(Etikett)`
    background: var(--speil-etikett-forlengelse-background);
    border: 1px solid var(--speil-etikett-forlengelse-border);
`;

const StyledFørstegangsbehandlingEtikett = styled(Etikett)`
    background: var(--speil-etikett-forstegangs-background);
    border: 1px solid var(--speil-etikett-forstegangs-border);
`;

const StyledInfotrygdforlengelseEtikett = styled(Etikett)`
    background: var(--speil-etikett-forlengelse-it-background);
    border: 1px solid var(--speil-etikett-forlengelse-it-border);
    color: var(--navds-color-text-inverse);
`;

const StyledStikkprøveEtikett = styled(Etikett)`
    background: var(--speil-etikett-stikkprove-background);
    border: 1px solid var(--speil-etikett-stikkprove-border);
    color: var(--navds-color-text-inverse);
`;

const StyledRiskQaEtikett = styled(Etikett)`
    background: var(--speil-etikett-risk-background);
    border: 1px solid var(--speil-etikett-risk-border);
    color: var(--navds-color-text-primary);
`;

export const RevurderingEtikett = ({ medLabel, label = <>Revurdering</>, størrelse = 'l', style }: EtikettProps) => {
    return <StyledRevurderingEtikett iconLabel={'R'} label={medLabel && label} størrelse={størrelse} style={style} />;
};

export const ForlengelseEtikett = ({ medLabel, label = <>Forlengelse</>, størrelse = 'l', style }: EtikettProps) => {
    return <StyledForlengelseEtikett iconLabel={'FL'} label={medLabel && label} størrelse={størrelse} style={style} />;
};

export const FørstegangsbehandlingEtikett = ({
    medLabel,
    label = <>Førstegang.</>,
    størrelse = 'l',
    style,
}: EtikettProps) => {
    return (
        <StyledFørstegangsbehandlingEtikett
            iconLabel={'F'}
            label={medLabel && label}
            størrelse={størrelse}
            style={style}
        />
    );
};

export const InfotrygdforlengelseEtikett = ({
    medLabel,
    label = <>Forlengelse IT</>,
    størrelse = 'l',
    style,
}: EtikettProps) => {
    return (
        <StyledInfotrygdforlengelseEtikett
            iconLabel={'FI'}
            label={medLabel && label}
            størrelse={størrelse}
            style={style}
        />
    );
};

export const StikkprøveEtikett = ({ medLabel, label = <>Stikkprøve</>, størrelse = 'l', style }: EtikettProps) => {
    return <StyledStikkprøveEtikett iconLabel={'S'} label={medLabel && label} størrelse={størrelse} style={style} />;
};

export const RiskQaEtikett = ({ medLabel, label = <>Risk QA</>, størrelse = 'l', style }: EtikettProps) => {
    return <StyledRiskQaEtikett iconLabel={'QA'} label={medLabel && label} størrelse={størrelse} style={style} />;
};

interface OppgaveetikettProps extends EtikettProps {
    type: Periodetype;
}

export const Oppgaveetikett = ({ type, størrelse = 'l', medLabel = false, style }: OppgaveetikettProps) => {
    switch (type) {
        case Periodetype.Forlengelse:
        case Periodetype.Infotrygdforlengelse:
            return <ForlengelseEtikett størrelse={størrelse} medLabel={medLabel} style={style} />;
        case Periodetype.Førstegangsbehandling:
            return <FørstegangsbehandlingEtikett størrelse={størrelse} medLabel={medLabel} style={style} />;
        case Periodetype.OvergangFraInfotrygd:
            return <InfotrygdforlengelseEtikett størrelse={størrelse} medLabel={medLabel} style={style} />;
        case Periodetype.Stikkprøve:
            return <StikkprøveEtikett størrelse={størrelse} medLabel={medLabel} style={style} />;
        case Periodetype.RiskQa:
            return <RiskQaEtikett størrelse={størrelse} medLabel={medLabel} style={style} />;
        default:
            return null;
    }
};
