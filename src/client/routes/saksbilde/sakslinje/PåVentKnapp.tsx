import React, { useContext } from 'react';
import { DropdownMenyknapp } from './Verktøylinje';
import { usePerson, useRefreshPerson } from '../../../state/person';
import { deletePåVent, postLeggPåVent } from '../../../io/http';
import { useOperasjonsvarsel } from '../../../state/varsler';
import { useHistory } from 'react-router';
import { DropdownContext } from '../../../components/Dropdown';
import { useAktivVedtaksperiode } from '../../../state/tidslinje';

const ignorePromise = (promise: Promise<any>, onError: (err: Error) => void) => {
    promise.catch(onError);
};

export const PåVentKnapp = () => {
    const history = useHistory();
    const erPåVent = usePerson()?.erPåVent;
    const oppgavereferanse = useAktivVedtaksperiode()?.oppgavereferanse;
    const errorHandler = useOperasjonsvarsel('Legg på vent');
    const { lukk } = useContext(DropdownContext);
    const refreshPerson = useRefreshPerson();

    if (!oppgavereferanse) {
        return null;
    }
    const leggpåVent = () => {
        ignorePromise(
            postLeggPåVent(oppgavereferanse).then(() => history.push('/')),
            errorHandler
        );
    };
    const fjernPåVent = () => {
        ignorePromise(
            deletePåVent(oppgavereferanse).then((response) => {
                lukk();
                refreshPerson();
            }),
            errorHandler
        );
    };

    return erPåVent ? (
        <DropdownMenyknapp onClick={fjernPåVent}>Fjern fra på vent</DropdownMenyknapp>
    ) : (
        <DropdownMenyknapp onClick={leggpåVent}>Legg på vent</DropdownMenyknapp>
    );
};
