import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { PersonFragment } from '@io/graphql';
import { useHarBeslutterrolle } from '@state/toggles';

export const useHarBeslutteroppgavetilgang = (person: PersonFragment): boolean => {
    const harBeslutterRolle = useHarBeslutterrolle();
    const erTidligereSaksbehandler = useErTidligereSaksbehandler(person);

    return harBeslutterRolle && !erTidligereSaksbehandler;
};
