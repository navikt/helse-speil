import React from 'react';
import { useEmail } from '../../../state/authentication';
import { DropdownMenyknapp } from './Verktøylinje';
import { useFjernTildeling, useTildelOppgave } from '../../../state/oppgaver';
import { Oppgave } from '../../../../types';

interface TildelingsknappProps {
    oppgavereferanse: string;
    tildeltTil: string | undefined;
}

export const Tildelingsknapp = ({ oppgavereferanse, tildeltTil }: TildelingsknappProps) => {
    const email = useEmail();
    const tildelOppgave = useTildelOppgave();
    const fjernTildeling = useFjernTildeling();
    const erTildeltInnloggetBruker = tildeltTil === email;

    return erTildeltInnloggetBruker ? (
        <DropdownMenyknapp onClick={() => fjernTildeling({ oppgavereferanse } as Oppgave)}>
            Meld av {erTildeltInnloggetBruker}{' '}
        </DropdownMenyknapp>
    ) : (
        <DropdownMenyknapp
            onClick={() => tildelOppgave({ oppgavereferanse } as Oppgave, email!)}
            disabled={tildeltTil !== undefined}
        >
            Tildel meg
        </DropdownMenyknapp>
    );
};
