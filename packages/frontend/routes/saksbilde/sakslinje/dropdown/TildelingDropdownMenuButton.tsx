import React, { useContext, useState } from 'react';

import { Loader } from '@navikt/ds-react';

import { Tildeling } from '@io/graphql';
import { useAddVarsel, useRemoveVarsel, VarselObject } from '@state/varsler';
import { DropdownButton, DropdownContext } from '@components/dropdown';
import { deleteTildeling, postTildeling } from '@io/http';
import { useMeldAvLokalTildeling, useTildelPerson } from '@state/person';

const TILDELINGSKEY = 'tildeling';

const createTildelingsvarsel = (message: string): VarselObject => ({ key: TILDELINGSKEY, message, type: 'info' });

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
    const fjernTildeling = useMeldAvLokalTildeling();
    const { lukk } = useContext(DropdownContext);

    const [isFetching, setIsFetching] = useState(false);

    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();

    return erTildeltInnloggetBruker ? (
        <DropdownButton
            onClick={() => {
                setIsFetching(true);
                removeVarsel(TILDELINGSKEY);
                deleteTildeling(oppgavereferanse)
                    .then(() => {
                        fjernTildeling();
                    })
                    .catch(() => addVarsel(createTildelingsvarsel('Kunne ikke fjerne tildeling av sak.')))
                    .finally(() => {
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
            disabled={tildeling !== undefined && tildeling !== null}
            onClick={() => {
                setIsFetching(true);
                removeVarsel(TILDELINGSKEY);
                postTildeling(oppgavereferanse)
                    .then(() => {
                        tildelPerson();
                    })
                    .catch(async (error) => {
                        if (error.statusCode === 409) {
                            const respons: any = await JSON.parse(error.message);
                            const { navn } = respons.kontekst.tildeling;
                            addVarsel(createTildelingsvarsel(`${navn} har allerede tatt saken.`));
                        } else {
                            addVarsel(createTildelingsvarsel('Kunne ikke tildele sak.'));
                        }
                    })
                    .finally(() => {
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
