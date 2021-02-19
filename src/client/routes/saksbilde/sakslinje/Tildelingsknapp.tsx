import React from 'react';
import { useEmail } from '../../../state/authentication';
import { DropdownMenyknapp } from './Verktøylinje';
import { useFjernTildeling, useTildelOppgave } from '../../../state/oppgaver';
import { Oppgave } from '../../../../types';
import { usePerson, useTildelPerson } from '../../../state/person';

interface TildelingsknappProps {
    oppgavereferanse: string;
    tildeltTil: string | undefined;
}

export const useErTildeltInnloggetBruker = () => {
    const personTilBehandling = usePerson();
    const tildeltTil = personTilBehandling?.tildeltTil;
    const email = useEmail();
    return tildeltTil === email;
};

export const Tildelingsknapp = ({ oppgavereferanse, tildeltTil }: TildelingsknappProps) => {
    const erTildeltInnloggetBruker = useErTildeltInnloggetBruker();
    const email = useEmail();
    const tildelTilPerson = useTildelPerson();
    const tildelOppgave = useTildelOppgave();
    const fjernTildeling = useFjernTildeling();

    return erTildeltInnloggetBruker ? (
        <DropdownMenyknapp
            onClick={() => fjernTildeling({ oppgavereferanse } as Oppgave).then(() => tildelTilPerson(undefined))}
        >
            Meld av {erTildeltInnloggetBruker}{' '}
        </DropdownMenyknapp>
    ) : (
        <DropdownMenyknapp
            onClick={() => tildelOppgave({ oppgavereferanse } as Oppgave, email!).then(() => tildelTilPerson(email))}
            disabled={tildeltTil !== undefined}
        >
            Tildel meg
        </DropdownMenyknapp>
    );
};
