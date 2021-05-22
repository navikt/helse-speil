import React, { useContext, useState } from 'react';
import { useOperasjonsvarsel } from '../../../state/varsler';
import { useHistory } from 'react-router';
import { DropdownContext, DropdownMenyknapp } from '../../../components/dropdown/Dropdown';
import { deletePåVent, postLeggPåVent } from '../../../io/http';
import { usePersonPåVent } from '../../../state/person';

const ignorePromise = (promise: Promise<any>, onError: (err: Error) => void) => {
    promise.catch(onError);
};

export interface PåVentKnappProps {
    erPåVent?: boolean;
    oppgavereferanse?: string;
}

export const PåVentKnapp = ({ erPåVent, oppgavereferanse }: PåVentKnappProps) => {
    const [isFetching, setIsFetching] = useState(false);
    const history = useHistory();
    const personPåVent = usePersonPåVent();
    const errorHandler = useOperasjonsvarsel('Legg på vent');
    const { lukk } = useContext(DropdownContext);

    if (!oppgavereferanse) {
        return null;
    }

    return erPåVent ? (
        <DropdownMenyknapp
            spinner={isFetching}
            onClick={() => {
                setIsFetching(true);
                ignorePromise(
                    deletePåVent(oppgavereferanse)
                        .then(() => {
                            personPåVent(false);
                        })
                        .finally(() => {
                            lukk();
                            setIsFetching(false);
                        }),
                    errorHandler
                );
            }}
        >
            Fjern fra på vent
        </DropdownMenyknapp>
    ) : (
        <DropdownMenyknapp
            spinner={isFetching}
            onClick={() => {
                setIsFetching(true);
                ignorePromise(
                    postLeggPåVent(oppgavereferanse)
                        .then(() => {
                            personPåVent(true); // Vi skal tilbake til oversikten, men for ordens skyld
                            history.push('/');
                        })
                        .finally(() => {
                            lukk();
                            setIsFetching(false);
                        }),
                    errorHandler
                );
            }}
        >
            Legg på vent
        </DropdownMenyknapp>
    );
};
