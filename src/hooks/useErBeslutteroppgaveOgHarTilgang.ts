import { useHarBeslutteroppgavetilgang } from '@hooks/useHarBeslutteroppgavetilgang';
import { useActivePeriodOld } from '@state/periode';
import { useTotrinnsvurderingErAktiv } from '@state/toggles';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useErBeslutteroppgaveOgHarTilgang = (): boolean => {
    const periode = useActivePeriodOld();
    const totrinnvurderingAktiv = useTotrinnsvurderingErAktiv();
    const harBeslutteroppgaveTilgang = useHarBeslutteroppgavetilgang();

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    return (
        totrinnvurderingAktiv && (periode.totrinnsvurdering?.erBeslutteroppgave ?? false) && harBeslutteroppgaveTilgang
    );
};
