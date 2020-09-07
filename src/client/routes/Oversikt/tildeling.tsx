import React, { useContext, useState } from 'react';
import { Oppgave, TildeltOppgave } from '../../../types';
import { useEmail } from '../../state/authentication';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { useOppgavetildeling } from '../../hooks/useOppgavetildeling';
import { OppgaverContext } from '../../context/OppgaverContext';
import { Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import styled from '@emotion/styled';
import Dropdown from '../../components/Dropdown';

const Flex = styled.span`
    display: flex;
    align-items: center;
`;

const Tildelingsalternativ = styled(Dropdown)`
    margin-left: 0.5rem;
`;

const MeldAvKnapp = styled.button`
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    padding: 1rem;
    cursor: pointer;
    background: #fff;
    border: none;
    border-radius: 0.25rem;
    outline: none;
    font-size: 1rem;
    white-space: nowrap;

    &:hover,
    &:focus {
        background: #e7e9e9;
    }
`;

export const Tildelt = ({ oppgave }: { oppgave: TildeltOppgave }) => {
    const email = useEmail();
    const erTildeltInnloggetBruker = oppgave.tildeltTil === email;
    const tildeltBrukernavn = capitalizeName(extractNameFromEmail(oppgave.tildeltTil));
    const { fjernTildeling } = useOppgavetildeling();
    const { markerOppgaveSomTildelt } = useContext(OppgaverContext);

    const meldAv = () => {
        fjernTildeling(oppgave.oppgavereferanse).then(() => markerOppgaveSomTildelt(oppgave));
    };

    return (
        <Flex>
            <Normaltekst>{tildeltBrukernavn}</Normaltekst>
            {erTildeltInnloggetBruker && (
                <Tildelingsalternativ>
                    <MeldAvKnapp tabIndex={0} onClick={meldAv}>
                        Meld av
                    </MeldAvKnapp>
                </Tildelingsalternativ>
            )}
        </Flex>
    );
};

export const IkkeTildelt = ({ oppgave }: { oppgave: Oppgave }) => {
    const email = useEmail();
    const [tildeler, setTildeler] = useState(false);
    const { tildelOppgave } = useOppgavetildeling();
    const { markerOppgaveSomTildelt } = useContext(OppgaverContext);

    const tildel = () => {
        if (!email) return;
        setTildeler(true);
        tildelOppgave(oppgave.oppgavereferanse, email)
            .then(() => markerOppgaveSomTildelt(oppgave, email))
            .catch((assignedUser) => markerOppgaveSomTildelt(oppgave, assignedUser))
            .finally(() => setTildeler(false));
    };

    return (
        <Knapp mini onClick={tildel} spinner={tildeler}>
            Tildel meg
        </Knapp>
    );
};
