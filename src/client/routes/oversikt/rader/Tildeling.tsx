import styled from '@emotion/styled';
import { Oppgave, TildeltOppgave } from 'internal-types';
import React, { useState } from 'react';

import { Knapp } from 'nav-frontend-knapper';

import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';
import { Tooltip } from '../../../components/Tooltip';
import { useInnloggetSaksbehandler } from '../../../state/authentication';
import { useTildeling } from '../../../state/oppgaver';

import { CellContainer, SkjultSakslenke, tooltipId } from './rader';

interface TildelingProps {
    oppgave: Oppgave;
}

const Tildelt = ({ oppgave }: TildelingProps) => {
    const tildeltTilNavn = (oppgave as TildeltOppgave).tildeling.saksbehandler.navn;

    return (
        <CellContainer width={128} data-tip={tildeltTilNavn} data-for={tooltipId('tildelt-til', oppgave)}>
            <TekstMedEllipsis>{tildeltTilNavn}</TekstMedEllipsis>
            <SkjultSakslenke oppgave={oppgave} />
            {tildeltTilNavn.length > 15 && <Tooltip id={tooltipId('tildelt-til', oppgave)} />}
        </CellContainer>
    );
};

const Tildelingsknapp = styled(Knapp)`
    min-height: 0;
    height: 1.5rem;
    padding: 0 0.75rem;
    box-sizing: border-box;
    font-size: var(--navds-font-size-xs);
`;

const IkkeTildelt = ({ oppgave }: TildelingProps) => {
    const saksbehandler = useInnloggetSaksbehandler();
    const [isFetching, setIsFetching] = useState(false);
    const { tildelOppgave } = useTildeling();

    const tildel = () => {
        if (!saksbehandler) return;
        if (isFetching) return;
        setIsFetching(true);
        tildelOppgave(oppgave, saksbehandler).catch(() => setIsFetching(false));
    };
    return (
        <CellContainer width={128}>
            <Tildelingsknapp mini onClick={tildel} spinner={isFetching}>
                Tildel meg
            </Tildelingsknapp>
        </CellContainer>
    );
};

export const Tildeling = React.memo(({ oppgave }: TildelingProps) =>
    oppgave.tildeling ? <Tildelt oppgave={oppgave} /> : <IkkeTildelt oppgave={oppgave} />
);
