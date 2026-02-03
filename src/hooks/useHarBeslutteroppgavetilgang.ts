import { useErBeslutter } from '@hooks/brukerrolleHooks';
import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { PersonFragment } from '@io/graphql';

export const useHarBeslutteroppgavetilgang = (person: PersonFragment): boolean => {
    const harBeslutterRolle = useErBeslutter();
    const erTidligereSaksbehandler = useErTidligereSaksbehandler(person);

    return harBeslutterRolle && !erTidligereSaksbehandler;
};
