import React, { useState } from 'react';
import { useEmail } from '../../state/authentication';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import styled from '@emotion/styled';
import { useFjernTildeling, useTildelOppgave } from '../../state/oppgaver';
import { SkjultSakslenke } from './rader';
import {Oppgave, TildeltOppgave} from "internal-types";

const Flex = styled.span`
    display: flex;
    align-items: center;
`;

export const Tildelt = ({ oppgave }: { oppgave: TildeltOppgave }) => {
    const tildeltBrukernavn = capitalizeName(extractNameFromEmail(oppgave.tildeltTil));

    return (
        <Flex>
            <Normaltekst>{tildeltBrukernavn}</Normaltekst>
        </Flex>
    );
};

export const IkkeTildelt = ({ oppgave }: { oppgave: Oppgave }) => {
    const email = useEmail();
    const [isFetching, setIsFetching] = useState(false);
    const tildelOppgave = useTildelOppgave();

    const tildel = () => {
        if (!email) return;
        if (isFetching) return;
        setIsFetching(true);
        tildelOppgave(oppgave, email).catch(() => setIsFetching(false));
    };

    return (
        <Knapp mini onClick={tildel} spinner={isFetching}>
            Tildel meg
        </Knapp>
    );
};

export const MeldAv = ({ oppgave }: { oppgave: Oppgave }) => {
    const email = useEmail();
    const [isFetching, setIsFetching] = useState(false);
    const fjernTildeling = useFjernTildeling();
    const erTildeltInnloggetBruker = oppgave.tildeltTil === email;

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
