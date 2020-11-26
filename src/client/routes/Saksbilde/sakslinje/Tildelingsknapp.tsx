import React, { useContext } from 'react';
import { useEmail } from '../../../state/authentication';
import { useOppgavetildeling } from '../../../hooks/useOppgavetildeling';
import { useUpdateVarsler } from '../../../state/varslerState';
import { PersonContext } from '../../../context/PersonContext';
import { Varseltype } from '@navikt/helse-frontend-varsel';
import { DropdownMenyknapp } from './Verktøylinje';

export const Tildelingsknapp = ({
    oppgavereferanse,
    tildeltTil,
}: {
    oppgavereferanse: string;
    tildeltTil: string | undefined;
}) => {
    const email = useEmail();
    const { fjernTildeling, tildelOppgave } = useOppgavetildeling();
    const { leggTilVarsel } = useUpdateVarsler();
    const { markerPersonSomTildelt } = useContext(PersonContext);
    const tildelingsvarsel = (message: string) => ({ message, type: Varseltype.Advarsel });
    const erTildeltInnloggetBruker = tildeltTil === email;

    const meldAvTildeling = () => {
        fjernTildeling(oppgavereferanse)
            .then(() => markerPersonSomTildelt(email))
            .catch(() => {
                leggTilVarsel(tildelingsvarsel('Kunne ikke fjerne tildeling av sak.'));
            });
    };

    const tildel = () => {
        tildelOppgave(oppgavereferanse, email!)
            .then(() => markerPersonSomTildelt(email))
            .catch((assignedUser) => markerPersonSomTildelt(assignedUser));
    };

    return erTildeltInnloggetBruker ? (
        <DropdownMenyknapp onClick={meldAvTildeling}>Meld av {erTildeltInnloggetBruker} </DropdownMenyknapp>
    ) : (
        <DropdownMenyknapp onClick={tildel} disabled={tildeltTil !== undefined}>
            Tildel meg
        </DropdownMenyknapp>
    );
};
