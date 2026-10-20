import dayjs from 'dayjs';
import { NextRequest } from 'next/server';

import { ApiEgenskap } from '@io/rest/generated/spesialist.schemas';
import { lokalSaksbehandlerOid } from '@spesialist-mock/constants';
import { hentSynkedeOppgaver } from '@spesialist-mock/oppgaveliste';

export async function stub(_request: NextRequest) {
    const mineOppgaver = hentSynkedeOppgaver().filter((oppgave) => oppgave.tildeling?.oid === lokalSaksbehandlerOid);
    const påVent = mineOppgaver.filter((oppgave) => oppgave.egenskaper.includes(ApiEgenskap.PA_VENT));
    const påVentNåddFrist = påVent.filter(
        (oppgave) => oppgave.påVentInfo?.tidsfrist != null && !dayjs(oppgave.påVentInfo.tidsfrist).isAfter(dayjs()),
    );
    return Response.json({
        antallMineSaker: mineOppgaver.length - påVent.length,
        antallMineSakerPåVent: påVent.length,
        antallMineSakerPåVentNåddFrist: påVentNåddFrist.length,
    });
}
