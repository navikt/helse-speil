import { useRecoilValue } from 'recoil';

import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { useHarBeslutteroppgavetilgang } from '@hooks/useHarBeslutteroppgavetilgang';
import { toggleReadOnly, toggleReadOnlyOverride } from '@state/toggles';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useIsReadOnlyOppgave = (): boolean => {
    const periode = useActivePeriod();
    const erTidligereSaksbehandler = useErTidligereSaksbehandler();
    const harBeslutteroppgavetilgang = useHarBeslutteroppgavetilgang();

    const readOnly = useRecoilValue(toggleReadOnly);
    const readOnlyOverride = useRecoilValue(toggleReadOnlyOverride);

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    if (readOnlyOverride) return readOnly;
    return erTidligereSaksbehandler || (periode.erBeslutterOppgave && !harBeslutteroppgavetilgang);
};
