import { useErBeslutteroppgaveOgErTidligereSaksbehandler } from '@hooks/useErBeslutteroppgaveOgErTidligereSaksbehandler';
import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { useRecoilValue } from 'recoil';
import { toggleReadOnly, toggleReadOnlyOverride } from '@state/toggles';

export const useReadOnlyOppgave = (): boolean => {
    const erTidligereSaksbehandler = useErTidligereSaksbehandler();
    const erBeslutteroppgaveOgErTidligereSaksbehandler = useErBeslutteroppgaveOgErTidligereSaksbehandler();

    const readOnlyOverride = useRecoilValue(toggleReadOnlyOverride);
    const readOnly = useRecoilValue(toggleReadOnly);

    if (readOnlyOverride) return readOnly;
    return erTidligereSaksbehandler || erBeslutteroppgaveOgErTidligereSaksbehandler;
};
