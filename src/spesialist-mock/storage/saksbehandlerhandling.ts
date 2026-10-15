import { ApiHandlingType, ApiSaksbehandlerhandling } from '@io/rest/generated/spesialist.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

// sindig_globus.json
const SINDIG_GLOBUS_FØDSELSNUMMER = '19886497256';

export class SaksbehandlerhandlingMock {
    private static handlinger: Map<string, ApiSaksbehandlerhandling[]> = new Map([
        [
            SINDIG_GLOBUS_FØDSELSNUMMER,
            [
                {
                    handlingId: 'a1f1c0de-0000-4000-8000-000000000001',
                    handlingType: ApiHandlingType.MANUELT_VURDERT_OPPTJENING,
                    saksbehandlerIdent: 'S123456',
                    tidspunkt: '2024-09-10T10:15:00.000',
                    skjæringstidspunkt: '2024-07-01',
                    behandlingId: '94926180-4e95-4879-8975-0a63b5659831',
                    erDelAvAktivTotrinnsvurdering: true,
                },
                {
                    handlingId: 'a1f1c0de-0000-4000-8000-000000000002',
                    handlingType: ApiHandlingType.MANUELT_VURDERT_OPPTJENING,
                    saksbehandlerIdent: 'S123456',
                    tidspunkt: '2024-07-20T09:00:00.000',
                    skjæringstidspunkt: '2024-07-01',
                    behandlingId: null,
                    erDelAvAktivTotrinnsvurdering: false,
                },
                {
                    handlingId: 'a1f1c0de-0000-4000-8000-000000000003',
                    handlingType: ApiHandlingType.MANUELT_VURDERT_OPPTJENING,
                    saksbehandlerIdent: 'A999999',
                    tidspunkt: '2024-07-10T08:30:00.000',
                    skjæringstidspunkt: null,
                    behandlingId: null,
                    erDelAvAktivTotrinnsvurdering: false,
                },
                {
                    handlingId: 'a1f1c0de-0000-4000-8000-000000000004',
                    handlingType: ApiHandlingType.NY_AUTOMATISK_OPPTJENINGSVURDERING,
                    saksbehandlerIdent: 'S123456',
                    tidspunkt: '2024-09-05T13:45:00.000',
                    skjæringstidspunkt: '2024-07-01',
                    behandlingId: null,
                    erDelAvAktivTotrinnsvurdering: false,
                },
            ],
        ],
    ]);

    static hentHandlinger(personPseudoId: string): ApiSaksbehandlerhandling[] {
        const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(personPseudoId);
        if (fødselsnummer === null) return [];
        return SaksbehandlerhandlingMock.handlinger.get(fødselsnummer) ?? [];
    }

    static leggTilHandling(
        personPseudoId: string,
        handling: Omit<ApiSaksbehandlerhandling, 'tidspunkt' | 'saksbehandlerIdent'>,
    ): void {
        const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(personPseudoId);
        if (fødselsnummer === null) return;
        const nyHandling: ApiSaksbehandlerhandling = {
            ...handling,
            saksbehandlerIdent: 'S123456',
            tidspunkt: new Date().toISOString(),
        };
        SaksbehandlerhandlingMock.handlinger.set(fødselsnummer, [
            ...(SaksbehandlerhandlingMock.handlinger.get(fødselsnummer) ?? []),
            nyHandling,
        ]);
    }
}
