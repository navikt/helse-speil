import { useRecoilValue } from 'recoil';

import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';
import { toggleTotrinnsvurderingAktiv } from '@state/toggles';
import { useHarBeslutteroppgavetilgang } from '@hooks/useHarBeslutteroppgavetilgang';

export const useErBeslutteroppgaveOgHarTilgang = (): boolean => {
    const periode = useActivePeriod();
    const totrinnvurderingAktiv = useRecoilValue(toggleTotrinnsvurderingAktiv);
    const harBeslutteroppgaveTilgang = useHarBeslutteroppgavetilgang();

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    return totrinnvurderingAktiv && periode.erBeslutterOppgave && harBeslutteroppgaveTilgang;
};
