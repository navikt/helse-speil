import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { Person } from '@io/graphql';
import { useHarBeslutterrolle, useTotrinnsvurderingErAktiv } from '@state/toggles';

export const useHarBeslutteroppgavetilgang = (person: Person): boolean => {
    const harBeslutterRolle = useHarBeslutterrolle();
    const totrinnvurderingAktiv = useTotrinnsvurderingErAktiv();
    const erTidligereSaksbehandler = useErTidligereSaksbehandler(person);

    return totrinnvurderingAktiv && harBeslutterRolle && !erTidligereSaksbehandler;
};
