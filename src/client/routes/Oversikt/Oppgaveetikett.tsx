import React from 'react';
import { OppgaveType } from '../../../types';
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

interface OppgaveetikettProps {
    type: OppgaveType;
}

export const Oppgaveetikett = ({ type }: OppgaveetikettProps) => {
    switch (type) {
        case OppgaveType.Forlengelse:
        case OppgaveType.Infotrygdforlengelse:
            return <Forlengelse>Forlengelse</Forlengelse>;
        case OppgaveType.Førstegangsbehandling:
            return <Førstegangsbehandling>Førstegang.</Førstegangsbehandling>;
        case OppgaveType.OvergangFraInfotrygd:
            return <Infotrygdforlengelse>Overgang fra IT</Infotrygdforlengelse>;
        default:
            return null;
    }
};
