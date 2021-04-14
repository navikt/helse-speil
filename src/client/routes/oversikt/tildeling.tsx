import React, { useState } from 'react';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import styled from '@emotion/styled';
import { useTildeling } from '../../state/oppgaver';
import { SkjultSakslenke } from './rader';
import { Oppgave} from 'internal-types';
import { useInnloggetSaksbehandler } from '../../state/authentication';
import {TekstMedEllipsis} from "../../components/TekstMedEllipsis";

export const Tildelt = ({ tildeltBrukernavn }: { tildeltBrukernavn: string }) => {

    return (
        <TekstMedEllipsis>{tildeltBrukernavn}</TekstMedEllipsis>
    );
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
    `

    return (
        <StyledKnapp mini onClick={tildel} spinner={isFetching}>
            Tildel meg
        </StyledKnapp>
    );
};

export const MeldAv = ({ oppgave }: { oppgave: Oppgave }) => {
    const { oid } = useInnloggetSaksbehandler();
    const [isFetching, setIsFetching] = useState(false);
    const { fjernTildeling } = useTildeling();
    const erTildeltInnloggetBruker = oppgave.tildeling?.saksbehandler.oid === oid;

    const meldAv = () => {
        setIsFetching(true);
        fjernTildeling(oppgave).finally(() => setIsFetching(false));
    };

    return erTildeltInnloggetBruker ? (
        <Flatknapp mini tabIndex={0} onClick={meldAv} spinner={isFetching}>
            Meld av
        </Flatknapp>
    ) : (
        <div>
            &nbsp;
            <SkjultSakslenke oppgave={oppgave} />
        </div>
    );
};
