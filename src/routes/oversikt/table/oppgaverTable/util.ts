import dayjs from 'dayjs';

import { ApiOppgaveProjeksjon, ApiOppgaveProjeksjonPaaVentInfo } from '@io/rest/generated/spesialist.schemas';
import { ISO_DATOFORMAT } from '@utils/date';

export namespace Oppgave {
    // Returnerer false hvis oppgaven ikke er på vent
    export function erTidsfristUtgått(oppgave: ApiOppgaveProjeksjon): boolean {
        return oppgave.paVentInfo != null && PåVentInfo.erTidsfristUtgått(oppgave.paVentInfo);
    }
}
export namespace PåVentInfo {
    export function erTidsfristUtgått(påVentInfo: ApiOppgaveProjeksjonPaaVentInfo): boolean {
        return dayjs(påVentInfo.tidsfrist, ISO_DATOFORMAT).isSameOrBefore(dayjs());
    }
}
