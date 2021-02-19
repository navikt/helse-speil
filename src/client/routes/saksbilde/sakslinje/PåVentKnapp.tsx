import React from 'react';
import { DropdownMenyknapp } from './Verktøylinje';
import { usePerson } from '../../../state/person';
import { deletePåVent, postLeggPåVent } from '../../../io/http';
import { useAktivVedtaksperiode } from '../../../state/vedtaksperiode';
import { useOperasjonsvarsel } from '../../../state/varsler';

const ignorePromise = (promise: Promise<any>, onError: (err: Error) => void) => {
    promise.catch(onError);
};

export const PåVentKnapp = () => {
    const erPåVent = usePerson()?.erPåVent;
    const oppgavereferanse = useAktivVedtaksperiode()?.oppgavereferanse;
    const errorHandler = useOperasjonsvarsel('Legg på vent');
    if (!oppgavereferanse) {
        return null;
    }
    const leggpåVent = () => {
        ignorePromise(postLeggPåVent(oppgavereferanse), errorHandler);
    };
    const fjernPåVent = () => {
        ignorePromise(deletePåVent(oppgavereferanse), errorHandler);
    };

    return erPåVent ? (
        <DropdownMenyknapp onClick={fjernPåVent}>Fjern fra vent</DropdownMenyknapp>
    ) : (
        <DropdownMenyknapp onClick={leggpåVent}>Legg på vent</DropdownMenyknapp>
    );
};
