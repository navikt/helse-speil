import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { PersonFragment } from '@io/graphql';
import { useHarBeslutterrolle, useTotrinnsvurderingErAktiv } from '@state/toggles';

export const useHarBeslutteroppgavetilgang = (person: PersonFragment): boolean => {
    const harBeslutterRolle = useHarBeslutterrolle();
    const totrinnvurderingAktiv = useTotrinnsvurderingErAktiv();
    const erTidligereSaksbehandler = useErTidligereSaksbehandler(person);

    return totrinnvurderingAktiv && harBeslutterRolle && !erTidligereSaksbehandler;
};
