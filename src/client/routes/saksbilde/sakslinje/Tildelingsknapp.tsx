import React, { useContext, useState } from 'react';
import { deleteTildeling, postTildeling } from '../../../io/http';
import { useTildelPerson } from '../../../state/person';
import { DropdownContext, DropdownMenyknapp } from '../../../components/dropdown/Dropdown';
import { Tildeling } from 'internal-types';
import { useAddVarsel, useRemoveVarsel } from '../../../state/varsler';
import { Varseltype } from '@navikt/helse-frontend-varsel';

interface TildelingsknappProps {
    oppgavereferanse: string;
    tildeling?: Tildeling;
    erTildeltInnloggetBruker: boolean;
}

const tildelingskey = 'tildeling';
const tildelingsvarsel = (message: string) => ({ key: tildelingskey, message, type: Varseltype.Info });

export const Tildelingsknapp = ({ oppgavereferanse, tildeling, erTildeltInnloggetBruker }: TildelingsknappProps) => {
    const [isFetching, setIsFetching] = useState(false);
    const { tildelPerson, fjernTildeling } = useTildelPerson();
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const { lukk } = useContext(DropdownContext);

    return erTildeltInnloggetBruker ? (
        <DropdownMenyknapp
            spinner={isFetching}
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
        </DropdownMenyknapp>
    ) : (
        <DropdownMenyknapp
            disabled={tildeling !== undefined}
            spinner={isFetching}
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
        </DropdownMenyknapp>
    );
};
