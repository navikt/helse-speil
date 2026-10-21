import { useHarBeslutterrolle } from '@hooks/brukerrolleHooks';
import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';

export const useHarBeslutteroppgavetilgang = (person: ApiSaksbildePerson): boolean => {
    const harBeslutterRolle = useHarBeslutterrolle();
    const erTidligereSaksbehandler = useErTidligereSaksbehandler(person);

    return harBeslutterRolle && !erTidligereSaksbehandler;
};
