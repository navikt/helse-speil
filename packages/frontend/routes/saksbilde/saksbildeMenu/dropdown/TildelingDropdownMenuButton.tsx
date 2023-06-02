import React, { useState } from 'react';

import { Loader } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';

import { Tildeling } from '@io/graphql';
import { useFjernTildeling, useOpprettTildeling } from '@state/tildeling';

interface TildelingDropdownMenuButtonProps {
    oppgavereferanse: string;
    tildeling?: Tildeling | null;
    erTildeltInnloggetBruker: boolean;
}

export const TildelingDropdownMenuButton = ({
    oppgavereferanse,
    tildeling,
    erTildeltInnloggetBruker,
}: TildelingDropdownMenuButtonProps) => {
    const tildelPerson = useOpprettTildeling();
    const fjernTildeling = useFjernTildeling();

    const [isFetching, setIsFetching] = useState(false);

    const håndterTildeling = (håndter: Promise<boolean | Tildeling>) => {
        setIsFetching(true);
        håndter.finally(() => {
            setIsFetching(false);
        });
    };

    if (erTildeltInnloggetBruker || tildeling) {
        return (
            <Tildelingsknapp
                knappetekst={erTildeltInnloggetBruker ? 'Meld av' : 'Frigi oppgave'}
                onClick={() => håndterTildeling(fjernTildeling(oppgavereferanse))}
                isFetching={isFetching}
            />
        );
    }
    return (
        <Tildelingsknapp
            knappetekst="Tildel meg"
            onClick={() => håndterTildeling(tildelPerson(oppgavereferanse))}
            isFetching={isFetching}
        />
    );
};

interface TildelingsknappProps {
    knappetekst: string;
    onClick: () => void;
    isFetching: boolean;
}

const Tildelingsknapp = ({ knappetekst, onClick, isFetching }: TildelingsknappProps) => (
    <Dropdown.Menu.List.Item disabled={isFetching} onClick={onClick}>
        {knappetekst}
        {isFetching && <Loader size="xsmall" />}
    </Dropdown.Menu.List.Item>
);
