import React from 'react';

import { ActionMenu, Loader } from '@navikt/ds-react';

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
    const [opprettTildeling, { loading: loadingOpprett }] = useOpprettTildeling();
    const [fjernTildeling, { loading: loadingFjern }] = useFjernTildeling();

    if (erTildeltInnloggetBruker || tildeling) {
        return (
            <Tildelingsknapp
                knappetekst={erTildeltInnloggetBruker ? 'Meld av' : 'Frigi oppgave'}
                onClick={() => fjernTildeling(oppgavereferanse)}
                isFetching={loadingFjern}
            />
        );
    }
    return (
        <Tildelingsknapp
            knappetekst="Tildel meg"
            onClick={() => opprettTildeling(oppgavereferanse)}
            isFetching={loadingOpprett}
        />
    );
};

interface TildelingsknappProps {
    knappetekst: string;
    onClick: () => void;
    isFetching: boolean;
}

const Tildelingsknapp = ({ knappetekst, onClick, isFetching }: TildelingsknappProps) => (
    <ActionMenu.Item disabled={isFetching} onSelect={onClick} className="text-ax-large">
        {knappetekst}
        {isFetching && <Loader size="xsmall" />}
    </ActionMenu.Item>
);
