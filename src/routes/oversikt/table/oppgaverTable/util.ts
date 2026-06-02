import dayjs from 'dayjs';

import { ApiOppgaveProjeksjon, ApiOppgaveProjeksjonPåVentInfo } from '@io/rest/generated/spesialist.schemas';
import { ISO_DATOFORMAT } from '@utils/date';

export namespace Oppgave {
    // Returnerer false hvis oppgaven ikke er på vent
    export function erTidsfristUtgått(oppgave: ApiOppgaveProjeksjon): boolean {
        return oppgave.påVentInfo != null && PåVentInfo.erTidsfristUtgått(oppgave.påVentInfo);
    }
}
export namespace PåVentInfo {
    export function erTidsfristUtgått(påVentInfo: ApiOppgaveProjeksjonPåVentInfo): boolean {
        return dayjs(påVentInfo.tidsfrist, ISO_DATOFORMAT).isSameOrBefore(dayjs());
    }
}
