import dayjs from 'dayjs';
import { NextResponse } from 'next/server';

import {
    ApiPeriodehistorikkType,
    ApiPeriodetilstand,
    ApiPostVedtakErrorCode,
    ApiServerSentEventEvent,
    ApiUtbetalingstatus,
} from '@io/rest/generated/spesialist.schemas';
import { lokalSaksbehandlerIdent, lokalSaksbehandlerNavn } from '@spesialist-mock/constants';
import { finnPeriodeForBehandlingId, harUvurderteVarsler } from '@spesialist-mock/periodeoppslag';
import { problemDetails } from '@spesialist-mock/problemDetails';
import { ferdigstillOppgave, pushEventEtterForsinkelse } from '@spesialist-mock/saksbehandling';
import { BehandlingMock } from '@spesialist-mock/storage/behandling';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { OverstyringMock } from '@spesialist-mock/storage/overstyring';
import { SaksbehandlerhandlingMock } from '@spesialist-mock/storage/saksbehandlerhandling';

export const stub = async (request: Request, params: Promise<{ behandlingId: string }>) => {
    const { behandlingId } = await params;
    // Spesialist lagrer begrunnelsen som vedtaksbegrunnelse. Mocken viser den ikke, så den leses bare.
    await request.text();

    const oppslag = finnPeriodeForBehandlingId(behandlingId);
    if (!oppslag) {
        return problemDetails(404, ApiPostVedtakErrorCode.BEHANDLING_IKKE_FUNNET, 'Fant ikke behandling');
    }
    const { periode, person, oppgaveId, totrinnsvurdering } = oppslag;
    if (!oppslag.erNyesteBehandling) {
        return problemDetails(
            400,
            ApiPostVedtakErrorCode.KAN_IKKE_FATTE_VEDTAK_PÅ_ELDRE_BEHANDLING,
            'Kan ikke fatte vedtak på en eldre behandling av vedtaksperioden',
        );
    }
    if (BehandlingMock.getEndring(behandlingId)?.vedtakFattet) {
        return problemDetails(409, ApiPostVedtakErrorCode.VEDTAK_ALLEREDE_FATTET, 'Vedtaket er allerede fattet');
    }
    if (!oppgaveId) {
        return problemDetails(400, ApiPostVedtakErrorCode.OPPGAVE_IKKE_FUNNET, 'Fant ikke oppgave');
    }
    if (periode.periodetilstand !== ApiPeriodetilstand.TilGodkjenning) {
        return problemDetails(400, ApiPostVedtakErrorCode.OPPGAVE_FEIL_TILSTAND, 'Oppgaven er i feil tilstand');
    }
    if (harUvurderteVarsler(periode)) {
        return problemDetails(
            400,
            ApiPostVedtakErrorCode.VARSLER_MANGLER_VURDERING,
            'Kan ikke godkjenne varsler som ikke er vurdert av en saksbehandler',
        );
    }
    if (totrinnsvurdering && !totrinnsvurdering.saksbehandler) {
        return problemDetails(
            409,
            ApiPostVedtakErrorCode.TOTRINNSVURDERING_MANGLER_SAKSBEHANDLER,
            'Behandlende saksbehandler mangler i totrinnsvurdering',
        );
    }

    // Lokalt finnes bare én saksbehandler, så mocken lar deg beslutte din egen oppgave
    if (totrinnsvurdering) {
        HistorikkinnslagMock.addHistorikkinnslag(periode.vedtaksperiodeId, {
            historikktype: ApiPeriodehistorikkType.TOTRINNSVURDERING_ATTESTERT,
        });
        SaksbehandlerhandlingMock.avsluttTotrinnsvurdering(person.fodselsnummer);
        OverstyringMock.ferdigstillForPerson(person.fodselsnummer);
        BehandlingMock.settTotrinnsvurdering(behandlingId, oppgaveId, null);
    }
    ferdigstillOppgave(oppslag, totrinnsvurdering ? lokalSaksbehandlerNavn : null);

    const vurdering = {
        automatisk: false,
        godkjent: true,
        ident: lokalSaksbehandlerIdent,
        tidsstempel: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    };
    BehandlingMock.oppdater(behandlingId, {
        vedtakFattet: true,
        periodetilstand: ApiPeriodetilstand.TilUtbetaling,
        utbetalingstatus: ApiUtbetalingstatus.SENDT,
        utbetalingsvurdering: vurdering,
    });

    pushEventEtterForsinkelse(person.fodselsnummer, ApiServerSentEventEvent.FERDIGBEHANDLET_GODKJENNINGSBEHOV, () =>
        BehandlingMock.oppdater(behandlingId, {
            periodetilstand: ApiPeriodetilstand.Utbetalt,
            utbetalingstatus: ApiUtbetalingstatus.UTBETALT,
        }),
    );

    return new NextResponse(null, { status: 204 });
};
