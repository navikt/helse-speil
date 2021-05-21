import React, { useContext, useState } from 'react';
import { useOperasjonsvarsel } from '../../state/varsler';
import { DropdownContext, DropdownMenyknapp } from '../../components/dropdown/Dropdown';
import { useTildeling } from '../../state/oppgaver';
import { Oppgave } from 'internal-types';
import { SpeilResponse } from 'src/client/io/http';

const ignorePromise = (promise: Promise<any>, onError: (err: Error) => void) => {
    promise.catch(onError);
};

export interface PåVentKnappProps {
    erPåVent: boolean;
    oppgavereferanse: string;
}

interface KnappProps {
    operasjon: () => Promise<Response | SpeilResponse>;
    knappetekst: string;
}

const Knapp = ({ operasjon, knappetekst }: KnappProps) => {
    const [isFetching, setIsFetching] = useState(false);
    const { lukk } = useContext(DropdownContext);
    const errorHandler = useOperasjonsvarsel('Legg på vent');

    return (
        <DropdownMenyknapp
            spinner={isFetching}
            onClick={() => {
                setIsFetching(true);
                ignorePromise(
                    operasjon().then(() => {
                        setIsFetching(false);
                        lukk();
                    }),
                    errorHandler
                );
            }}
        >
            {knappetekst}
        </DropdownMenyknapp>
    );
};

export const OversiktPåVentKnapp = ({ erPåVent, oppgavereferanse }: PåVentKnappProps) => {
    const { leggPåVent, fjernPåVent } = useTildeling();

    const props = erPåVent
        ? { operasjon: () => fjernPåVent({ oppgavereferanse } as Oppgave), knappetekst: 'Fjern fra på vent' }
        : { operasjon: () => leggPåVent({ oppgavereferanse } as Oppgave), knappetekst: 'Legg på vent' };

    return <Knapp {...props} />;
};
