import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { useHarBeslutterrolle, useTotrinnsvurderingErAktiv } from '@state/toggles';

export const useHarBeslutteroppgavetilgang = (): boolean => {
    const harBeslutterRolle = useHarBeslutterrolle();
    const totrinnvurderingAktiv = useTotrinnsvurderingErAktiv();
    const erTidligereSaksbehandler = useErTidligereSaksbehandler();

    return totrinnvurderingAktiv && harBeslutterRolle && !erTidligereSaksbehandler;
};
