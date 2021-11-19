import React, { useContext, useState } from 'react';

import { Loader } from '@navikt/ds-react';

import { DropdownContext, DropdownMenyknapp } from '../../../components/dropdown/Dropdown';
import { deleteTildeling, postTildeling } from '../../../io/http';
import { useTildelPerson } from '../../../state/person';
import { useAddVarsel, useRemoveVarsel, VarselObject } from '../../../state/varsler';

interface TildelingsknappProps {
    oppgavereferanse: string;
    tildeling?: Tildeling;
    erTildeltInnloggetBruker: boolean;
}

const tildelingskey = 'tildeling';
const tildelingsvarsel = (message: string): VarselObject => ({ key: tildelingskey, message, type: 'info' });

export const Tildelingsknapp = ({ oppgavereferanse, tildeling, erTildeltInnloggetBruker }: TildelingsknappProps) => {
    const [isFetching, setIsFetching] = useState(false);
    const { tildelPerson, fjernTildeling } = useTildelPerson();
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const { lukk } = useContext(DropdownContext);

    return erTildeltInnloggetBruker ? (
        <DropdownMenyknapp
            onClick={() => {
                setIsFetching(true);
                removeVarsel(tildelingskey);
                deleteTildeling(oppgavereferanse)
                    .then(() => {
                        fjernTildeling();
                    })
                    .catch(() => addVarsel(tildelingsvarsel('Kunne ikke fjerne tildeling av sak.')))
                    .finally(() => {
                        lukk();
                        setIsFetching(false);
                    });
            }}
        >
            Meld av
            {isFetching && <Loader size="xsmall" />}
        </DropdownMenyknapp>
    ) : (
        <DropdownMenyknapp
            disabled={tildeling !== undefined}
            onClick={() => {
                setIsFetching(true);
                removeVarsel(tildelingskey);
                postTildeling(oppgavereferanse)
                    .then(() => {
                        tildelPerson();
                    })
                    .catch(async (error) => {
                        if (error.statusCode === 409) {
                            const respons: any = await JSON.parse(error.message);
                            const { navn } = respons.kontekst.tildeling;
                            addVarsel(tildelingsvarsel(`${navn} har allerede tatt saken.`));
                        } else {
                            addVarsel(tildelingsvarsel('Kunne ikke tildele sak.'));
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
        </DropdownMenyknapp>
    );
};
