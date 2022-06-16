import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';
import { toggleTotrinnsvurderingAktiv } from '@state/toggles';
import { useRecoilValue } from 'recoil';

export const useErBeslutteroppgaveOgHarTilgang = (): boolean => {
    const periode = useActivePeriod();
    const totrinnvurderingAktiv = useRecoilValue(toggleTotrinnsvurderingAktiv);
    // TODO const harBeslutterRolle = useRecoilValue(toggleHarBeslutterRolle);

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    return totrinnvurderingAktiv && periode.erBeslutterOppgave;
};
