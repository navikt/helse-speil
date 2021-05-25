import styled from '@emotion/styled';
import { Oppgave } from 'internal-types';
import React, { useState } from 'react';

import { Knapp } from 'nav-frontend-knapper';

import { TekstMedEllipsis } from '../../components/TekstMedEllipsis';
import { useInnloggetSaksbehandler } from '../../state/authentication';
import { useTildeling } from '../../state/oppgaver';

export const Tildelt = ({ tildeltBrukernavn }: { tildeltBrukernavn: string }) => {
    return <TekstMedEllipsis>{tildeltBrukernavn}</TekstMedEllipsis>;
};

export const IkkeTildelt = ({ oppgave }: { oppgave: Oppgave }) => {
    const saksbehandler = useInnloggetSaksbehandler();
    const [isFetching, setIsFetching] = useState(false);
    const { tildelOppgave } = useTildeling();

    const tildel = () => {
        if (!saksbehandler) return;
        if (isFetching) return;
        setIsFetching(true);
        tildelOppgave(oppgave, saksbehandler).catch(() => setIsFetching(false));
    };

    const StyledKnapp = styled(Knapp)`
        min-height: 0;
        height: 1.5rem;
        padding: 0 0.75rem;
        box-sizing: border-box;
        font-size: var(--navds-font-size-xs);
    `;

    return (
        <StyledKnapp mini onClick={tildel} spinner={isFetching}>
            Tildel meg
        </StyledKnapp>
    );
};
