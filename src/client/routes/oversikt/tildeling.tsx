import React, { useState } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import styled from '@emotion/styled';
import { useTildeling } from '../../state/oppgaver';
import { SkjultSakslenke } from './rader';
import { Oppgave, TildeltOppgave } from 'internal-types';
import { useInnloggetSaksbehandler } from '../../state/authentication';

const Flex = styled.span`
    display: flex;
    align-items: center;
`;

export const Tildelt = ({ oppgave }: { oppgave: TildeltOppgave }) => {
    const tildeltBrukernavn = oppgave.tildeling.saksbehandler.navn;

    return (
        <Flex>
            <Normaltekst>{tildeltBrukernavn}</Normaltekst>
        </Flex>
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

    return (
        <Knapp mini onClick={tildel} spinner={isFetching}>
            Tildel meg
        </Knapp>
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
