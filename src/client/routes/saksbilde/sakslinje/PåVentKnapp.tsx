import React from 'react';
import { DropdownMenyknapp } from './Verktøylinje';
import { usePerson } from '../../../state/person';
import { deletePåVent, postLeggPåVent } from '../../../io/http';
import { useAktivVedtaksperiode } from '../../../state/vedtaksperiode';
import { useOperasjonsvarsel } from '../../../state/varsler';
import { useHistory } from 'react-router';

const ignorePromise = (promise: Promise<any>, onError: (err: Error) => void) => {
    promise.catch(onError);
};

export const PåVentKnapp = () => {
    const history = useHistory();
    const erPåVent = usePerson()?.erPåVent;
    const oppgavereferanse = useAktivVedtaksperiode()?.oppgavereferanse;
    const errorHandler = useOperasjonsvarsel('Legg på vent');
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
            deletePåVent(oppgavereferanse).then(() => history.push('/')),
            errorHandler
        );
    };

    return erPåVent ? (
        <DropdownMenyknapp onClick={fjernPåVent}>Fjern fra på vent</DropdownMenyknapp>
    ) : (
        <DropdownMenyknapp onClick={leggpåVent}>Legg på vent</DropdownMenyknapp>
    );
};
