import React, { useState } from 'react';
import { Loader } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';

import { Tildeling } from '@io/graphql';
import { useFjernTildeling, useTildelPerson } from '@state/person';

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
    const tildelPerson = useTildelPerson();
    const fjernTildeling = useFjernTildeling();

    const [isFetching, setIsFetching] = useState(false);

    return erTildeltInnloggetBruker ? (
        <Dropdown.Menu.List.Item
            disabled={isFetching}
            onClick={() => {
                setIsFetching(true);
                fjernTildeling(oppgavereferanse).finally(() => {
                    setIsFetching(false);
                });
            }}
        >
            Meld av
            {isFetching && <Loader size="xsmall" />}
        </Dropdown.Menu.List.Item>
    ) : (
        <Dropdown.Menu.List.Item
            disabled={!!tildeling || isFetching}
            onClick={() => {
                setIsFetching(true);
                tildelPerson(oppgavereferanse).finally(() => {
                    setIsFetching(false);
                });
            }}
        >
            Tildel meg
            {isFetching && <Loader size="xsmall" />}
        </Dropdown.Menu.List.Item>
    );
};
