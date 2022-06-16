import { useRecoilValue } from 'recoil';

import { toggleHarBeslutterRolle, toggleTotrinnsvurderingAktiv } from '@state/toggles';
import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';

export const useHarBeslutteroppgavetilgang = (): boolean => {
    const harBeslutterRolle = useRecoilValue(toggleHarBeslutterRolle);
    const totrinnvurderingAktiv = useRecoilValue(toggleTotrinnsvurderingAktiv);
    const erTidligereSaksbehandler = useErTidligereSaksbehandler();

    return totrinnvurderingAktiv && harBeslutterRolle && !erTidligereSaksbehandler;
};
