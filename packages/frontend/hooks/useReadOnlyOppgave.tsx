import { useErBeslutteroppgaveOgErTidligereSaksbehandler } from '@hooks/useErBeslutteroppgaveOgErTidligereSaksbehandler';

export const useReadOnlyOppgave = (): boolean => {
    return useErBeslutteroppgaveOgErTidligereSaksbehandler();
};
