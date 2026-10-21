import dayjs from 'dayjs';
import { NextResponse } from 'next/server';

import {
    ApiPostVedtaksperiodeAnnullerErrorCode,
    ApiServerSentEventEvent,
    ApiVedtaksperiodeAnnullerRequest,
} from '@io/rest/generated/spesialist.schemas';
import { lokalSaksbehandlerIdent } from '@spesialist-mock/constants';
import { finnNyestePeriodeForVedtaksperiodeId } from '@spesialist-mock/periodeoppslag';
import { problemDetails } from '@spesialist-mock/problemDetails';
import { pushEventEtterForsinkelse } from '@spesialist-mock/saksbehandling';
import { Periodetilstand, Utbetalingstatus } from '@spesialist-mock/schemaTypes';
import { BehandlingMock } from '@spesialist-mock/storage/behandling';

export const stub = async (request: Request, params: Promise<{ vedtaksperiodeId: string }>) => {
    const { vedtaksperiodeId } = await params;
    const { årsaker, kommentar }: ApiVedtaksperiodeAnnullerRequest = await request.json();

    const oppslag = finnNyestePeriodeForVedtaksperiodeId(vedtaksperiodeId);
    if (!oppslag) {
        return problemDetails(
            404,
            ApiPostVedtaksperiodeAnnullerErrorCode.VEDTAKSPERIODE_IKKE_FUNNET,
            'Fant ikke vedtaksperiode',
        );
    }
    const { periode, person } = oppslag;
    if (periode.annullering) {
        return problemDetails(
            409,
            ApiPostVedtaksperiodeAnnullerErrorCode.ALLEREDE_ANNULLERT,
            'Perioden er allerede annullert',
        );
    }

    // Spleis annullerer alle kandidatene i sykefraværstilfellet, ikke bare perioden det ble trykket på
    const vedtaksperiodeIder = new Set([
        vedtaksperiodeId,
        ...(periode.annulleringskandidater ?? []).map((kandidat) => kandidat.vedtaksperiodeId),
    ]);
    const behandlingIder = Array.from(vedtaksperiodeIder)
        .map((id) => finnNyestePeriodeForVedtaksperiodeId(id)?.periode.behandlingId)
        .filter((id): id is string => id !== undefined);

    behandlingIder.forEach((behandlingId) =>
        BehandlingMock.oppdater(behandlingId, {
            periodetilstand: Periodetilstand.TilAnnullering,
            annullering: {
                arbeidsgiverFagsystemId: periode.utbetaling.arbeidsgiverFagsystemId,
                personFagsystemId: periode.utbetaling.personFagsystemId,
                arsaker: årsaker.map((årsak) => årsak.årsak),
                begrunnelse: kommentar ?? null,
                saksbehandlerIdent: lokalSaksbehandlerIdent,
                tidspunkt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
                vedtaksperiodeId,
            },
        }),
    );

    pushEventEtterForsinkelse(person.fodselsnummer, ApiServerSentEventEvent.UTBETALING_ANNULLERING_OK, () =>
        behandlingIder.forEach((behandlingId) =>
            BehandlingMock.oppdater(behandlingId, {
                periodetilstand: Periodetilstand.Annullert,
                utbetalingstatus: Utbetalingstatus.Annullert,
            }),
        ),
    );

    return new NextResponse(null, { status: 204 });
};
