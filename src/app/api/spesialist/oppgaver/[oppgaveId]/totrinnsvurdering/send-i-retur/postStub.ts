import { NextRequest, NextResponse } from 'next/server';

import {
    ApiPeriodehistorikkType,
    ApiPostSendIReturErrorCode,
    ApiSendIReturRequest,
    ApiServerSentEventEvent,
} from '@io/rest/generated/spesialist.schemas';
import { lokalSaksbehandlerOid, lokalTildeling } from '@spesialist-mock/constants';
import { finnPeriodeForOppgaveId } from '@spesialist-mock/periodeoppslag';
import { problemDetails } from '@spesialist-mock/problemDetails';
import { pushEventEtterForsinkelse } from '@spesialist-mock/saksbehandling';
import { BehandlingMock } from '@spesialist-mock/storage/behandling';
import { DialogMock } from '@spesialist-mock/storage/dialog';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { PaVentMock } from '@spesialist-mock/storage/påvent';
import { TildelingMock } from '@spesialist-mock/storage/tildeling';

export const postStub = async (request: NextRequest, params: Promise<{ oppgaveId: string }>) => {
    const { oppgaveId } = await params;
    const { notatTekst }: ApiSendIReturRequest = await request.json();

    const oppslag = finnPeriodeForOppgaveId(oppgaveId);
    if (!oppslag) {
        return problemDetails(404, ApiPostSendIReturErrorCode.OPPGAVE_IKKE_FUNNET, 'Oppgave ikke funnet');
    }
    const { periode, personPseudoId, person } = oppslag;
    const totrinnsvurdering = periode.totrinnsvurdering;
    if (!totrinnsvurdering) {
        return problemDetails(
            409,
            ApiPostSendIReturErrorCode.TOTRINNSVURDERING_IKKE_FUNNET,
            'Aktiv totrinnsvurdering mangler for oppgaven',
        );
    }
    if (!totrinnsvurdering.saksbehandler) {
        return problemDetails(
            409,
            ApiPostSendIReturErrorCode.TOTRINNSVURDERING_MANGLER_SAKSBEHANDLER,
            'Totrinnsvurdering mangler opprinnelig saksbehandler',
        );
    }
    if (!totrinnsvurdering.erBeslutteroppgave) {
        return problemDetails(
            409,
            ApiPostSendIReturErrorCode.OPPGAVE_ALLEREDE_SENDT_I_RETUR,
            'Oppgaven er allerede sendt i retur',
        );
    }

    BehandlingMock.settTotrinnsvurdering(periode.behandlingId, oppgaveId, {
        erBeslutteroppgave: false,
        erRetur: true,
        saksbehandler: totrinnsvurdering.saksbehandler,
        beslutter: lokalSaksbehandlerOid,
    });

    // Oppgaven går tilbake til opprinnelig saksbehandler, som lokalt alltid er deg
    TildelingMock.setTildeling(personPseudoId, lokalTildeling);

    // Spesialist tar oppgaven av vent uten eget historikkinnslag
    PaVentMock.fjernPåVent(oppgaveId);

    HistorikkinnslagMock.addHistorikkinnslag(periode.vedtaksperiodeId, {
        historikktype: ApiPeriodehistorikkType.TOTRINNSVURDERING_RETUR,
        notattekst: notatTekst,
        dialogRef: DialogMock.addDialog(),
    });

    pushEventEtterForsinkelse(person.fodselsnummer, ApiServerSentEventEvent.PERSONDATA_OPPDATERT);

    return new NextResponse(null, { status: 204 });
};
