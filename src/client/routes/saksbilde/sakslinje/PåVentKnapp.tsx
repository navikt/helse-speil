import React, {useContext, useState} from 'react';
import {useRefreshPerson} from '../../../state/person';
import {useOperasjonsvarsel} from '../../../state/varsler';
import {useHistory} from 'react-router';
import {DropdownContext, DropdownMenyknapp} from '../../../components/dropdown/Dropdown';
import {useTildeling} from "../../../state/oppgaver";
import {Oppgave} from "internal-types";

const ignorePromise = (promise: Promise<any>, onError: (err: Error) => void) => {
    promise.catch(onError);
};

export interface PåVentKnappProps {
    erPåVent?: boolean;
    oppgavereferanse?: string;
}

export const PåVentKnapp = ({erPåVent, oppgavereferanse}: PåVentKnappProps) => {
    const [isFetching, setIsFetching] = useState(false);
    const history = useHistory();
    const errorHandler = useOperasjonsvarsel('Legg på vent');
    const { lukk } = useContext(DropdownContext);
    const refreshPerson = useRefreshPerson();
    const { leggPåVent, fjernPåVent } = useTildeling()

    if (!oppgavereferanse) {
        return null;
    }

    return erPåVent ? (
        <DropdownMenyknapp
            spinner={isFetching}
            onClick={() => {
                setIsFetching(true)
                ignorePromise(fjernPåVent({oppgavereferanse} as Oppgave).then(() => {
                    lukk();
                    refreshPerson();
                    setIsFetching(false)
                }), errorHandler)
            }}
        >
            Fjern fra på vent
        </DropdownMenyknapp>
    ) : (
        <DropdownMenyknapp
            spinner={isFetching}
            onClick={() => {
                setIsFetching(true)
                ignorePromise(leggPåVent({oppgavereferanse} as Oppgave).then(() => {
                    lukk()
                    history.push('/');
                    setIsFetching(false)
                }), errorHandler)
            }}
        >
            Legg på vent
        </DropdownMenyknapp>
    );
};
