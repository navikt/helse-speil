import styled from '@emotion/styled';
import { Periodetype } from 'internal-types';
import React from 'react';

interface EtikettProps {
    størrelse?: 's' | 'l';
}

const Etikett = styled.div<EtikettProps>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    text-align: center;
    padding: 0.5rem;
    font-weight: 600;
    border-radius: 0.25rem;

    width: ${(props) => (props.størrelse === 'l' ? '20px' : '16px')};
    height: ${(props) => (props.størrelse === 'l' ? '20px' : '16px')};
    font-size: ${(props) => (props.størrelse === 'l' ? '14px' : '12px')};

    :before {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`;

const RevurderingEtikett = styled(Etikett)`
    background: var(--nav-lime-gronn-lighten-80);
    border: 1px solid var(--nav-lime-gronn-darken-40);

    :before {
        content: 'R';
    }
`;

const ForlengelseEtikett = styled(Etikett)`
    background: var(--speil-etikett-forlengelse-background);
    border: 1px solid var(--speil-etikett-forlengelse-border);

    :before {
        content: 'FL';
    }
`;

const FørstegangsbehandlingEtikett = styled(Etikett)`
    background: var(--speil-etikett-forstegangs-background);
    border: 1px solid var(--speil-etikett-forstegangs-border);

    :before {
        content: 'F';
    }
`;

const InfotrygdforlengelseEtikett = styled(Etikett)`
    background: var(--speil-etikett-forlengelse-it-background);
    border: 1px solid var(--speil-etikett-forlengelse-it-border);
    color: var(--navds-color-text-inverse);

    :before {
        content: 'FI';
    }
`;

const StikkprøveEtikett = styled(Etikett)`
    background: var(--speil-etikett-stikkprove-background);
    border: 1px solid var(--speil-etikett-stikkprove-border);
    color: var(--navds-color-text-inverse);

    :before {
        content: 'S';
    }
`;

const RiskQaEtikett = styled(Etikett)`
    background: var(--speil-etikett-risk-background);
    border: 1px solid var(--speil-etikett-risk-border);
    color: var(--navds-color-text-primary);

    :before {
        content: 'QA';
    }
`;

interface OppgaveetikettProps extends EtikettProps {
    type: Periodetype;
}

export const Oppgaveetikett = ({ type, størrelse = 'l' }: OppgaveetikettProps) => {
    switch (type) {
        case Periodetype.Forlengelse:
        case Periodetype.Infotrygdforlengelse:
            return <ForlengelseEtikett størrelse={størrelse} />;
        case Periodetype.Førstegangsbehandling:
            return <FørstegangsbehandlingEtikett størrelse={størrelse} />;
        case Periodetype.OvergangFraInfotrygd:
            return <InfotrygdforlengelseEtikett størrelse={størrelse} />;
        case Periodetype.Stikkprøve:
            return <StikkprøveEtikett størrelse={størrelse} />;
        case Periodetype.RiskQa:
            return <RiskQaEtikett størrelse={størrelse} />;
        case Periodetype.Revurdering:
            return <RevurderingEtikett størrelse={størrelse} />;
        default:
            return null;
    }
};
