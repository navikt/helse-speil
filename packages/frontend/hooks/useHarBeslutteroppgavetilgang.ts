import { useRecoilValue } from 'recoil';

import { toggleHarBeslutterRolle, toggleTotrinnsvurderingAktiv } from '@state/toggles';
import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';

export const useHarBeslutteroppgavetilgang = (): boolean => {
    const harBeslutterRolle = useRecoilValue(toggleHarBeslutterRolle);
    const totrinnvurderingAktiv = useRecoilValue(toggleTotrinnsvurderingAktiv);
    const erTidligereSaksbehandler = useErTidligereSaksbehandler();

    console.log('harBeslutterRolle er: ' + harBeslutterRolle);
    console.log('totrinnvurderingAktiv er: ' + totrinnvurderingAktiv);
    console.log('!erTidligereSaksbehandler er: ' + !erTidligereSaksbehandler);

    return totrinnvurderingAktiv && harBeslutterRolle && !erTidligereSaksbehandler;
};
