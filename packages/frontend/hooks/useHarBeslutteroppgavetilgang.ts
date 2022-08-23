import { useHarBeslutterrolle, useTotrinnsvurderingErAktiv } from '@state/toggles';
import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';

export const useHarBeslutteroppgavetilgang = (): boolean => {
    const harBeslutterRolle = useHarBeslutterrolle();
    const totrinnvurderingAktiv = useTotrinnsvurderingErAktiv();
    const erTidligereSaksbehandler = useErTidligereSaksbehandler();

    return totrinnvurderingAktiv && harBeslutterRolle && !erTidligereSaksbehandler;
};
