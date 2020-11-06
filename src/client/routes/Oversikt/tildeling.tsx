import React, { useContext, useState } from 'react';
import { Oppgave, TildeltOppgave } from '../../../types';
import { useEmail } from '../../state/authentication';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { useOppgavetildeling } from '../../hooks/useOppgavetildeling';
import { OppgaverContext } from '../../context/OppgaverContext';
import { Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import styled from '@emotion/styled';

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
    const [tildeler, setTildeler] = useState(false);
    const { tildelOppgave } = useOppgavetildeling();
    const { markerOppgaveSomTildelt } = useContext(OppgaverContext);

    const tildel = () => {
        if (!email) return;
        if (tildeler) return;
        setTildeler(true);
        tildelOppgave(oppgave.oppgavereferanse, email)
            .then(() => markerOppgaveSomTildelt(oppgave, email))
            .catch((assignedUser) => {
                markerOppgaveSomTildelt(oppgave, assignedUser);
                setTildeler(false);
            });
    };

    return (
        <Knapp mini onClick={tildel} spinner={tildeler}>
            Tildel meg
        </Knapp>
    );
};
