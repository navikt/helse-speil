import { useGetSaksbehandlerhandlingerForPerson } from '@io/rest/generated/personer/personer';
import { ApiHandlingType, ApiSaksbehandlerhandling } from '@io/rest/generated/spesialist.schemas';

export function useHentSaksbehandlerhandlinger(personPseudoId?: string) {
    return useGetSaksbehandlerhandlingerForPerson(personPseudoId!, {
        query: {
            enabled: !!personPseudoId,
        },
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
