import React, { useContext, useState } from 'react';

import { Loader } from '@navikt/ds-react';

import { Tildeling } from '@io/graphql';
import { deleteTildeling, postTildeling } from '@io/http';
import { DropdownButton, DropdownContext } from '@components/dropdown';
import { useMeldAvLokalTildeling, useTildelPerson } from '@state/person';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { SpeilError } from '@utils/error';

const TILDELINGSKEY = 'tildeling';

class TildelingAlert extends SpeilError {
    name = TILDELINGSKEY;

    constructor(message: string) {
        super(message);
        this.severity = 'info';
    }
}

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
                    .catch(() => addVarsel(new TildelingAlert('Kunne ikke fjerne tildeling av sak.')))
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
                            addVarsel(new TildelingAlert(`${navn} har allerede tatt saken.`));
                        } else {
                            addVarsel(new TildelingAlert('Kunne ikke tildele sak.'));
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
