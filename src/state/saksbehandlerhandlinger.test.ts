import { ApiHandlingType, ApiSaksbehandlerhandling } from '@io/rest/generated/spesialist.schemas';
import { saksbehandlerhandlingGjelderPeriode } from '@state/saksbehandlerhandlinger';

describe('saksbehandlerhandlingGjelderPeriode', () => {
    const periode = { behandlingId: 'behandling-1', skjaeringstidspunkt: '2024-01-01' };

    test('gjelder kun perioden med samme behandlingId når behandlingId er satt', () => {
        const handling = enSaksbehandlerhandling({ behandlingId: 'behandling-1', skjæringstidspunkt: '2024-01-01' });
        expect(saksbehandlerhandlingGjelderPeriode(handling, periode)).toBe(true);
        expect(saksbehandlerhandlingGjelderPeriode(handling, { ...periode, behandlingId: 'behandling-2' })).toBe(false);
    });

    test('gjelder alle perioder med samme skjæringstidspunkt når kun skjæringstidspunkt er satt', () => {
        const handling = enSaksbehandlerhandling({ skjæringstidspunkt: '2024-01-01' });
        expect(saksbehandlerhandlingGjelderPeriode(handling, periode)).toBe(true);
        expect(saksbehandlerhandlingGjelderPeriode(handling, { ...periode, behandlingId: 'behandling-2' })).toBe(true);
        expect(saksbehandlerhandlingGjelderPeriode(handling, { ...periode, skjaeringstidspunkt: '2024-02-01' })).toBe(
            false,
        );
    });

    test('gjelder alle perioder når verken behandlingId eller skjæringstidspunkt er satt', () => {
        const handling = enSaksbehandlerhandling();
        expect(saksbehandlerhandlingGjelderPeriode(handling, periode)).toBe(true);
        expect(
            saksbehandlerhandlingGjelderPeriode(handling, { behandlingId: 'annen', skjaeringstidspunkt: '2020-01-01' }),
        ).toBe(true);
    });
});

function enSaksbehandlerhandling(overrides?: Partial<ApiSaksbehandlerhandling>): ApiSaksbehandlerhandling {
    return {
        handlingId: 'handling-id',
        handlingType: ApiHandlingType.MANUELT_VURDERT_OPPTJENING,
        saksbehandlerIdent: 'S123456',
        tidspunkt: '2024-01-10T12:00:00',
        skjæringstidspunkt: null,
        behandlingId: null,
        erDelAvAktivTotrinnsvurdering: false,
        ...overrides,
    };
}
