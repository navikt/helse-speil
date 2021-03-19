import React, { useState } from 'react';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import styled from '@emotion/styled';
import { useFjernTildeling, useTildelOppgave } from '../../state/oppgaver';
import { SkjultSakslenke } from './rader';
import {Oppgave, TildeltOppgave} from "internal-types";
import { useInnloggetSaksbehandler } from '../../state/authentication';

const Flex = styled.span`
    display: flex;
    align-items: center;
`;

export const Tildelt = ({ oppgave }: { oppgave: TildeltOppgave }) => {
    const tildeltBrukernavn = capitalizeName(extractNameFromEmail(oppgave.tildeling.epost));

    return (
        <Flex>
            <Normaltekst>{tildeltBrukernavn}</Normaltekst>
        </Flex>
    );
};

export const IkkeTildelt = ({ oppgave }: { oppgave: Oppgave }) => {
    const saksbehandler = useInnloggetSaksbehandler();
    const [isFetching, setIsFetching] = useState(false);
    const tildelOppgave = useTildelOppgave();

    const toTildeling = () => {
        return {
            oid: saksbehandler.oid!,
            epost: saksbehandler.email!,
            navn: saksbehandler.name!,
            påVent: false,
        };
    };

    const tildel = () => {
        if (!saksbehandler.isLoggedIn) return;
        if (isFetching) return;
        setIsFetching(true);
        tildelOppgave(oppgave, toTildeling()).catch(() => setIsFetching(false));
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
    const fjernTildeling = useFjernTildeling();
    const erTildeltInnloggetBruker = oppgave.tildeling?.oid === oid;

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
