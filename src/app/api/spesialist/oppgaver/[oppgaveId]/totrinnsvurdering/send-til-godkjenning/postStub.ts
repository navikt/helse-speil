import { NextRequest, NextResponse } from 'next/server';

import {
    ApiPostSendTilGodkjenningErrorCode,
    ApiSendTilGodkjenningRequest,
    ApiServerSentEventEvent,
} from '@io/rest/generated/spesialist.schemas';
import { lokalSaksbehandlerOid, lokalTildeling } from '@spesialist-mock/constants';
import { finnPeriodeForOppgaveId, harUvurderteVarsler } from '@spesialist-mock/periodeoppslag';
import { problemDetails } from '@spesialist-mock/problemDetails';
import { pushEventEtterForsinkelse } from '@spesialist-mock/saksbehandling';
import { PeriodehistorikkType } from '@spesialist-mock/schemaTypes';
import { BehandlingMock } from '@spesialist-mock/storage/behandling';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { PaVentMock } from '@spesialist-mock/storage/påvent';
import { TildelingMock } from '@spesialist-mock/storage/tildeling';

export const postStub = async (request: NextRequest, params: Promise<{ oppgaveId: string }>) => {
    const { oppgaveId } = await params;
    // Spesialist lagrer begrunnelsen som vedtaksbegrunnelse. Mocken viser den ikke, så den leses bare.
    (await request.json()) as ApiSendTilGodkjenningRequest;

    const oppslag = finnPeriodeForOppgaveId(oppgaveId);
    if (!oppslag) {
        return problemDetails(404, ApiPostSendTilGodkjenningErrorCode.OPPGAVE_IKKE_FUNNET, 'Oppgave ikke funnet');
    }
    const { periode, personPseudoId, person } = oppslag;
    if (harUvurderteVarsler(periode)) {
        return problemDetails(
            409,
            ApiPostSendTilGodkjenningErrorCode.MANGLER_VURDERING_AV_VARSLER,
            'Det finnes aktive varsler som mangler vurdering',
        );
    }
    const totrinnsvurdering = periode.totrinnsvurdering;
    if (!totrinnsvurdering) {
        return problemDetails(
            409,
            ApiPostSendTilGodkjenningErrorCode.TOTRINNSVURDERING_IKKE_FUNNET,
            'Aktiv totrinnsvurdering mangler for oppgaven',
        );
    }
    if (totrinnsvurdering.erBeslutteroppgave) {
        return problemDetails(
            409,
            ApiPostSendTilGodkjenningErrorCode.OPPGAVE_ALLEREDE_SENDT_TIL_BESLUTTER,
            'Oppgaven er allerede sendt til beslutter',
        );
    }

    BehandlingMock.settTotrinnsvurdering(periode.behandlingId, oppgaveId, {
        erBeslutteroppgave: true,
        erRetur: false,
        saksbehandler: lokalSaksbehandlerOid,
        beslutter: totrinnsvurdering.beslutter ?? null,
    });

    // Oppgaven tildeles tidligere beslutter ved ny runde, ellers ligger den ledig for beslutter
    if (totrinnsvurdering.beslutter) {
        TildelingMock.setTildeling(personPseudoId, lokalTildeling);
    } else {
        TildelingMock.fjernTildeling(personPseudoId);
    }

    // Spesialist tar oppgaven av vent uten eget historikkinnslag
    PaVentMock.fjernPåVent(oppgaveId);

    HistorikkinnslagMock.addHistorikkinnslag(periode.vedtaksperiodeId, {
        type: PeriodehistorikkType.TotrinnsvurderingTilGodkjenning,
    });

    pushEventEtterForsinkelse(person.fodselsnummer, ApiServerSentEventEvent.PERSONDATA_OPPDATERT);

    return new NextResponse(null, { status: 204 });
};
