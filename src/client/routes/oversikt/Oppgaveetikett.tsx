import React from 'react';
import { Periodetype } from '../../../types';
import styled from '@emotion/styled';

const Etikett = styled.div`
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    width: max-content;
`;

const Forlengelse = styled(Etikett)`
    background: #e0f5fb;
    border: 1px solid #5690a2;
`;

const Førstegangsbehandling = styled(Etikett)`
    background: #e0dae7;
    border: 1px solid #634689;
`;

const Infotrygdforlengelse = styled(Etikett)`
    background: #59514b;
    border: 1px solid #59514b;
    color: #fff;
`;

const Stikkprøve = styled(Etikett)`
    background: #c86151;
    border: 1px solid #ba3a26;
    color: #fff;
`;

const RiskQa = styled(Etikett)`
    background: #ffdbab;
    border: 1px solid #d87f0a;
    color: #3e3832;
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
