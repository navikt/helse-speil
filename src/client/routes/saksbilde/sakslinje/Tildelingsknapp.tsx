import React, { useContext } from 'react';
import { useInnloggetSaksbehandler } from '../../../state/authentication';
import { DropdownMenyknapp } from './Verktøylinje';
import { useFjernTildeling, useTildelOppgave } from '../../../state/oppgaver';
import { usePerson, useRefreshPerson, useTildelPerson } from '../../../state/person';
import { DropdownContext } from '../../../components/Dropdown';
import { Oppgave, Tildeling } from 'internal-types';

interface TildelingsknappProps {
    oppgavereferanse: string;
    tildeling?: Tildeling;
}

export const useErTildeltInnloggetBruker = () => {
    const personTilBehandling = usePerson();
    const tildeling = personTilBehandling?.tildeling;
    const { oid } = useInnloggetSaksbehandler();
    return tildeling?.saksbehandler.oid === oid;
};

export const Tildelingsknapp = ({ oppgavereferanse, tildeling }: TildelingsknappProps) => {
    const erTildeltInnloggetBruker = useErTildeltInnloggetBruker();
    const saksbehandler = useInnloggetSaksbehandler();
    const tildelPerson = useTildelPerson();
    const tildelOppgave = useTildelOppgave();
    const fjernTildeling = useFjernTildeling();
    const refreshPerson = useRefreshPerson();
    const { lukk } = useContext(DropdownContext);

    return erTildeltInnloggetBruker ? (
        <DropdownMenyknapp
            onClick={() =>
                fjernTildeling({ oppgavereferanse } as Oppgave).then(() => {
                    lukk();
                    tildelPerson(undefined);
                    refreshPerson();
                })
            }
        >
            Meld av
        </DropdownMenyknapp>
    ) : (
        <DropdownMenyknapp
            onClick={() =>
                tildelOppgave({ oppgavereferanse } as Oppgave, saksbehandler).then(() => {
                    lukk();
                    tildelPerson(saksbehandler);
                })
            }
            disabled={tildeling !== undefined}
        >
            Tildel meg
        </DropdownMenyknapp>
    );
};
