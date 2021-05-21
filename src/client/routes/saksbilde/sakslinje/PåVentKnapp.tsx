import React, { useContext, useState } from 'react';
import { useOperasjonsvarsel } from '../../../state/varsler';
import { useHistory } from 'react-router';
import { DropdownContext, DropdownMenyknapp } from '../../../components/dropdown/Dropdown';
import { deletePåVent, postLeggPåVent } from '../../../io/http';
import { usePersonPåVent } from '../../../state/person';
import { useInnloggetSaksbehandler } from '../../../state/authentication';

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
    const errorHandler = useOperasjonsvarsel('Legg på vent');
    const { lukk } = useContext(DropdownContext);
    const saksbehandler = useInnloggetSaksbehandler();
    const personPåVent = usePersonPåVent();

    if (!oppgavereferanse) {
        return null;
    }

    const påVent = (påVent: boolean) => personPåVent({ saksbehandler, påVent });

    return erPåVent ? (
        <DropdownMenyknapp
            spinner={isFetching}
            onClick={() => {
                setIsFetching(true);
                ignorePromise(
                    deletePåVent(oppgavereferanse)
                        .then(() => {
                            påVent(false);
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
                            påVent(true); // Vi skal tilbake til oversikten, men for ordens skyld
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
