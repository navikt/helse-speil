import React, { useContext, useState } from 'react';
import { useInnloggetSaksbehandler } from '../../../state/authentication';
import { useTildeling } from '../../../state/oppgaver';
import { useRefreshPerson, useTildelPerson } from '../../../state/person';
import { DropdownContext, DropdownMenyknapp } from '../../../components/dropdown/Dropdown';
import { Oppgave, Tildeling } from 'internal-types';

interface TildelingsknappProps {
    oppgavereferanse: string;
    tildeling?: Tildeling;
    erTildeltInnloggetBruker: boolean;
}

export const Tildelingsknapp = ({ oppgavereferanse, tildeling, erTildeltInnloggetBruker }: TildelingsknappProps) => {
    const [isFetching, setIsFetching] = useState(false);
    const saksbehandler = useInnloggetSaksbehandler();
    const tildelPerson = useTildelPerson();
    const { fjernTildeling, tildelOppgave } = useTildeling();
    const refreshPerson = useRefreshPerson();
    const { lukk } = useContext(DropdownContext);

    return erTildeltInnloggetBruker ? (
        <DropdownMenyknapp
            spinner={isFetching}
            onClick={() => {
                setIsFetching(true);
                fjernTildeling({ oppgavereferanse } as Oppgave).then(() => {
                    lukk();
                    tildelPerson(undefined);
                    refreshPerson();
                    setIsFetching(false);
                });
            }}
        >
            Meld av
        </DropdownMenyknapp>
    ) : (
        <DropdownMenyknapp
            disabled={tildeling !== undefined}
            spinner={isFetching}
            onClick={() => {
                setIsFetching(true);
                tildelOppgave({ oppgavereferanse } as Oppgave, saksbehandler).then(() => {
                    lukk();
                    tildelPerson(saksbehandler);
                    setIsFetching(false);
                });
            }}
        >
            Tildel meg
        </DropdownMenyknapp>
    );
};
