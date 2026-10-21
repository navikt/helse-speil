import { NextResponse } from 'next/server';

import {
    ApiForkastingRequest,
    ApiPeriodetilstand,
    ApiPostForkastingErrorCode,
    ApiServerSentEventEvent,
    ApiUtbetalingstatus,
} from '@io/rest/generated/spesialist.schemas';
import { finnPeriodeForBehandlingId } from '@spesialist-mock/periodeoppslag';
import { problemDetails } from '@spesialist-mock/problemDetails';
import { ferdigstillOppgave, pushEventEtterForsinkelse } from '@spesialist-mock/saksbehandling';
import { BehandlingMock } from '@spesialist-mock/storage/behandling';
import { OverstyringMock } from '@spesialist-mock/storage/overstyring';

export const stub = async (request: Request, params: Promise<{ behandlingId: string }>) => {
    const { behandlingId } = await params;
    (await request.json()) as ApiForkastingRequest;

    const oppslag = finnPeriodeForBehandlingId(behandlingId);
    if (!oppslag) {
        return problemDetails(404, ApiPostForkastingErrorCode.BEHANDLING_IKKE_FUNNET, 'Fant ikke behandling');
    }
    const { periode, person } = oppslag;
    if (!periode.oppgave) {
        return problemDetails(400, ApiPostForkastingErrorCode.OPPGAVE_IKKE_FUNNET, 'Fant ikke oppgave.');
    }
    if (periode.periodetilstand !== ApiPeriodetilstand.TilGodkjenning) {
        return problemDetails(400, ApiPostForkastingErrorCode.OPPGAVE_FEIL_TILSTAND, 'Oppgaven er i feil tilstand.');
    }
    if (periode.totrinnsvurdering?.erBeslutteroppgave) {
        return problemDetails(
            400,
            ApiPostForkastingErrorCode.TOTRINNSVURDERING_SENDT_TIL_BESLUTTER,
            'Totrinnsvurdering er sendt til beslutter, saken må returneres til saksbehandler før den kan kastes ut',
        );
    }

    ferdigstillOppgave(oppslag, null);
    OverstyringMock.ferdigstillForPerson(person.fodselsnummer);
    BehandlingMock.oppdater(behandlingId, {
        erForkastet: true,
        periodetilstand: ApiPeriodetilstand.TilInfotrygd,
        utbetalingstatus: ApiUtbetalingstatus.FORKASTET,
    });

    pushEventEtterForsinkelse(person.fodselsnummer, ApiServerSentEventEvent.FERDIGBEHANDLET_GODKJENNINGSBEHOV);

    return new NextResponse(null, { status: 204 });
};
