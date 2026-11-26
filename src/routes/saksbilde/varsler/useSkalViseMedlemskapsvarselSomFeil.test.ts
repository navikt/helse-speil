import { Mock } from 'vitest';

import { ApiMedlemskapsstatus } from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { useGetVilkårsvurderingerForPersonBehandler } from '@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger';
import { finnPeriodeTilGodkjenning } from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { renderHook } from '@test-utils';

import { useVilkårsgrunnlag } from '../sykepengegrunnlag/useVilkårsgrunnlag';
import { useSkalViseMedlemskapsvarselSomFeil } from './useSkalViseMedlemskapsvarselSomFeil';

vi.mock('next/navigation', () => ({ useParams: () => ({ personPseudoId: 'en-person' }) }));
vi.mock('@state/person', () => ({ useFetchPersonQuery: () => ({ data: {} }) }));
vi.mock('@state/periode', () => ({ useActivePeriod: vi.fn() }));
vi.mock('@state/inntektsforhold/inntektsforhold', () => ({ finnPeriodeTilGodkjenning: vi.fn() }));
vi.mock('../sykepengegrunnlag/useVilkårsgrunnlag', () => ({ useVilkårsgrunnlag: vi.fn() }));
vi.mock('@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger', () => ({
    useGetVilkårsvurderingerForPersonBehandler: vi.fn(),
}));

describe('useSkalViseMedlemskapsvarselSomFeil', () => {
    beforeEach(() => {
        (useActivePeriod as Mock).mockReturnValue({ skjaeringstidspunkt: '2024-01-01' });
        (finnPeriodeTilGodkjenning as Mock).mockReturnValue({ skjaeringstidspunkt: '2024-01-01' });
        (useVilkårsgrunnlag as Mock).mockReturnValue({ medlemskapsvurderingId: 'en-medlemskapsvurdering' });
        medlemskapsstatus(ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL);
    });

    it('viser varselet som feil når medlemskapet er uavklart med brukerspørsmål', () => {
        const { result } = renderHook(() => useSkalViseMedlemskapsvarselSomFeil());

        expect(result.current).toEqual({ skalViseSomFeil: true, henterStatus: false });
        expect(useGetVilkårsvurderingerForPersonBehandler).toHaveBeenCalledWith(
            'en-person',
            { medlemskapsvurderingId: 'en-medlemskapsvurdering' },
            { query: { enabled: true } },
        );
    });

    it('henter status uten å vise varselet som feil mens medlemskapsstatusen hentes', () => {
        (useGetVilkårsvurderingerForPersonBehandler as Mock).mockReturnValue({ data: undefined, isLoading: true });

        const { result } = renderHook(() => useSkalViseMedlemskapsvarselSomFeil());

        expect(result.current).toEqual({ skalViseSomFeil: false, henterStatus: true });
    });

    it('viser varselet som feil når sp-medlemskap ikke svarer', () => {
        (useGetVilkårsvurderingerForPersonBehandler as Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
        });

        const { result } = renderHook(() => useSkalViseMedlemskapsvarselSomFeil());

        expect(result.current).toEqual({ skalViseSomFeil: true, henterStatus: false });
    });

    it.each([ApiMedlemskapsstatus.JA, ApiMedlemskapsstatus.NEI, ApiMedlemskapsstatus.UAVKLART])(
        'viser ikke varselet som feil når status er %s',
        (status) => {
            medlemskapsstatus(status);

            const { result } = renderHook(() => useSkalViseMedlemskapsvarselSomFeil());

            expect(result.current.skalViseSomFeil).toBe(false);
        },
    );

    it('viser ikke varselet som feil når aktiv periode har et annet skjæringstidspunkt', () => {
        (useActivePeriod as Mock).mockReturnValue({ skjaeringstidspunkt: '2023-01-01' });

        const { result } = renderHook(() => useSkalViseMedlemskapsvarselSomFeil());

        expect(result.current.skalViseSomFeil).toBe(false);
    });
});

function medlemskapsstatus(status: ApiMedlemskapsstatus) {
    (useGetVilkårsvurderingerForPersonBehandler as Mock).mockReturnValue({
        data: { medlemskapsvurdering: { status } },
        isLoading: false,
    });
}
