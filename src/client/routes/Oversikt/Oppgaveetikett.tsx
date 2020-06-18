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
    border: 1px solid #66cbec;
`;

const Førstegangsbehandling = styled(Etikett)`
    background: #cce1f3;
    border: 1px solid #0067c5;
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
            return <Forlengelse>Forlengelse</Forlengelse>;
        case OppgaveType.Førstegangsbehandling:
            return <Førstegangsbehandling>Førstegang.</Førstegangsbehandling>;
        case OppgaveType.Infotrygdforlengelse:
            return <Infotrygdforlengelse>Forlengelse - IT</Infotrygdforlengelse>;
        default:
            return null;
    }
};
