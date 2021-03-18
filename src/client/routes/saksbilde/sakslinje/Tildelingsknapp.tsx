import React, { useContext } from 'react';
import { useEmail } from '../../../state/authentication';
import { DropdownMenyknapp } from './Verktøylinje';
import { useFjernTildeling, useTildelOppgave } from '../../../state/oppgaver';
import { usePerson, useRefreshPerson, useTildelPerson } from '../../../state/person';
import { DropdownContext } from '../../../components/Dropdown';
import {Oppgave} from "internal-types";

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
    const refreshPerson = useRefreshPerson();
    const { lukk } = useContext(DropdownContext);

    return erTildeltInnloggetBruker ? (
        <DropdownMenyknapp
            onClick={() =>
                fjernTildeling({ oppgavereferanse } as Oppgave).then(() => {
                    lukk();
                    tildelTilPerson(undefined);
                    refreshPerson();
                })
            }
        >
            Meld av
        </DropdownMenyknapp>
    ) : (
        <DropdownMenyknapp
            onClick={() =>
                tildelOppgave({ oppgavereferanse } as Oppgave, email!).then(() => {
                    lukk();
                    tildelTilPerson(email);
                })
            }
            disabled={tildeltTil !== undefined}
        >
            Tildel meg
        </DropdownMenyknapp>
    );
};
