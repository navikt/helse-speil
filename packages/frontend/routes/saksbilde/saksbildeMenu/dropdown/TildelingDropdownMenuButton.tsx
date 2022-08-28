import React, { useContext, useState } from 'react';

import { Loader } from '@navikt/ds-react';

import { Tildeling } from '@io/graphql';
import { DropdownButton, DropdownContext } from '@components/dropdown';
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
    const { lukk } = useContext(DropdownContext);

    const [isFetching, setIsFetching] = useState(false);

    return erTildeltInnloggetBruker ? (
        <DropdownButton
            disabled={isFetching}
            onClick={() => {
                setIsFetching(true);
                fjernTildeling(oppgavereferanse).finally(() => {
                    lukk();
                    setIsFetching(false);
                });
            }}
        >
            Meld av
            {isFetching && <Loader size="xsmall" />}
        </DropdownButton>
    ) : (
        <DropdownButton
            disabled={!!tildeling || isFetching}
            onClick={() => {
                setIsFetching(true);
                tildelPerson(oppgavereferanse).finally(() => {
                    lukk();
                    setIsFetching(false);
                });
            }}
        >
            Tildel meg
            {isFetching && <Loader size="xsmall" />}
        </DropdownButton>
    );
};

export default TildelingDropdownMenuButton;
