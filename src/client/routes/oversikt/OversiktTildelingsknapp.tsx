import { Oppgave, Tildeling } from 'internal-types';
import React, { useContext, useState } from 'react';

import { DropdownContext, DropdownMenyknapp } from '../../components/dropdown/Dropdown';
import { SpeilResponse } from '../../io/http';
import { useInnloggetSaksbehandler } from '../../state/authentication';
import { useTildeling } from '../../state/oppgaver';

interface TildelingsknappProps {
    oppgavereferanse: string;
    tildeling?: Tildeling;
    erTildeltInnloggetBruker: boolean;
}

interface KnappProps {
    operasjon: () => Promise<Response | SpeilResponse>;
    knappetekst: string;
    disabled?: boolean;
}

const Knapp = ({ operasjon, knappetekst, disabled }: KnappProps) => {
    const [isFetching, setIsFetching] = useState(false);
    const { lukk } = useContext(DropdownContext);

    return (
        <DropdownMenyknapp
            disabled={disabled}
            spinner={isFetching}
            onClick={() => {
                setIsFetching(true);
                operasjon().then(() => {
                    setIsFetching(false);
                    lukk();
                });
            }}
        >
            {knappetekst}
        </DropdownMenyknapp>
    );
};

export const OversiktTildelingsknapp = ({
    oppgavereferanse,
    tildeling,
    erTildeltInnloggetBruker,
}: TildelingsknappProps) => {
    const saksbehandler = useInnloggetSaksbehandler();
    const { fjernTildeling, tildelOppgave } = useTildeling();

    const props = erTildeltInnloggetBruker
        ? { operasjon: () => fjernTildeling({ oppgavereferanse } as Oppgave), knappetekst: 'Meld av' }
        : {
              operasjon: () => tildelOppgave({ oppgavereferanse } as Oppgave, saksbehandler),
              knappetekst: 'Tildel meg',
              disabled: tildeling !== undefined,
          };

    return <Knapp {...props} />;
};
