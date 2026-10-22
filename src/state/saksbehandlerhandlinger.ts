import { HttpError, getJson } from '@app/fetch/fetchClient';
import { withDefaultQueryOptions } from '@io/rest/defaultQueryOptions';
import { useGetSaksbehandlerhandlingerForPerson } from '@io/rest/generated/personer/personer';
import { ApiHandlingType, ApiSaksbehandlerhandling } from '@io/rest/generated/spesialist.schemas';
import { Handlingsvisning, handlingsvisningSchema } from '@io/rest/handlingsvisning';
import { useQuery } from '@tanstack/react-query';

export function useHentSaksbehandlerhandlinger(personPseudoId?: string) {
    return useGetSaksbehandlerhandlingerForPerson(personPseudoId!, {
        query: {
            enabled: !!personPseudoId,
        },
    });
}

export function useSaksbehandlerhandlingVisning(url: string) {
    return useQuery<Handlingsvisning, HttpError>({
        ...withDefaultQueryOptions({ queryKey: [url] }),
        queryFn: async ({ signal }) => handlingsvisningSchema.parse(await getJson(url, { signal })),
    });
}

export function saksbehandlerhandlingGjelderPeriode(
    handling: ApiSaksbehandlerhandling,
    periode: { behandlingId: string; skjaeringstidspunkt: string },
): boolean {
    if (handling.behandlingId) return handling.behandlingId === periode.behandlingId;
    if (handling.skjæringstidspunkt) return handling.skjæringstidspunkt === periode.skjaeringstidspunkt;
    return true;
}

export function harSaksbehandlerhandlingIAktivTotrinnsvurdering(handlinger?: ApiSaksbehandlerhandling[]): boolean {
    return handlinger?.some((handling) => handling.erDelAvAktivTotrinnsvurdering) ?? false;
}

export function tilSaksbehandlerhandlingTekst(handlingType: ApiHandlingType): string {
    switch (handlingType) {
        case ApiHandlingType.MANUELT_VURDERT_OPPTJENING:
            return 'Opptjening vurdert manuelt';
        case ApiHandlingType.NY_AUTOMATISK_OPPTJENINGSVURDERING:
            return 'Opptjening vurdert automatisk på nytt';
    }
}

export function tilSaksbehandlerhandlingKontrolltekst(handlingType: ApiHandlingType): string {
    switch (handlingType) {
        case ApiHandlingType.MANUELT_VURDERT_OPPTJENING:
            return 'Manuell vurdering av opptjening';
        case ApiHandlingType.NY_AUTOMATISK_OPPTJENINGSVURDERING:
            return 'Ny automatisk vurdering av opptjening';
    }
}

// handlingId er id-en handlingen har i domenetjenesten som eier den, og handlingType bestemmer hvilken tjeneste det er.
// null betyr at handlingen ikke har detaljer, og innslaget kan da ikke ekspanderes.
export function tilVisningUrl(
    handlingType: ApiHandlingType,
    personPseudoId: string,
    handlingId: string,
): string | null {
    const domene = domeneMedDetaljer(handlingType);
    if (!domene) return null;
    return `/api/${domene}/personer/${encodeURIComponent(personPseudoId)}/saksbehandlerhandlinger/${encodeURIComponent(handlingId)}/visning`;
}

// Domenet må ha en proxy-rute under src/app/api/<domene>/personer/[personPseudoId]/saksbehandlerhandlinger/[handlingId]/visning
function domeneMedDetaljer(handlingType: ApiHandlingType): 'vilkarsproving' | null {
    switch (handlingType) {
        case ApiHandlingType.MANUELT_VURDERT_OPPTJENING:
            return 'vilkarsproving';
        case ApiHandlingType.NY_AUTOMATISK_OPPTJENINGSVURDERING:
            return null;
    }
}
