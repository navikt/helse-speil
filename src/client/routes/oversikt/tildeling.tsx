import React, { useState } from 'react';
import { Oppgave, TildeltOppgave } from '../../../types';
import { useEmail } from '../../state/authentication';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import styled from '@emotion/styled';
import { useTildelOppgave } from '../../state/oppgaver';

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
    const tildelOppgave = useTildelOppgave();

    const tildel = () => {
        if (!email) return;
        if (tildeler) return;
        setTildeler(true);
        tildelOppgave(oppgave, email).catch(() => setTildeler(false));
    };

    return (
        <Knapp mini onClick={tildel} spinner={tildeler}>
            Tildel meg
        </Knapp>
    );
};
