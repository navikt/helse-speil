import { Mock, vi } from 'vitest';

import {
    ApiGraderteAndreYtelser,
    ApiYrkesaktivitetstype,
} from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import {
    useGetGraderteAndreYtelser,
    useGetGraderteAndreYtelserVersjon,
} from '@io/rest/generated/andre-ytelser/graderte-andre-ytelser/graderte-andre-ytelser';
import { useGraderteAndreYtelserForPeriode } from '@state/graderteAndreYtelser';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enUberegnetPeriode } from '@test-data/periode';
import { renderHook } from '@test-utils';
import { generateId } from '@utils/generateId';

vi.mock('@io/rest/generated/andre-ytelser/graderte-andre-ytelser/graderte-andre-ytelser', () => ({
    useGetGraderteAndreYtelser: vi.fn(),
    useGetGraderteAndreYtelserVersjon: vi.fn(),
}));

describe('useGraderteAndreYtelserForPeriode', () => {
    const versjon = generateId();
    const eldrePeriode = enBeregnetPeriode({ graderteAndreYtelserVersjon: versjon });
    const eldrePeriodeUtenVersjon = enBeregnetPeriode({ graderteAndreYtelserVersjon: null });
    const eldreUberegnetPeriode = enUberegnetPeriode();
    const gjeldendePeriode = enBeregnetPeriode({ graderteAndreYtelserVersjon: generateId() });
    const arbeidsgiver = enArbeidsgiver({
        behandlinger: [
            enBehandling({ perioder: [gjeldendePeriode] }),
            enBehandling({ perioder: [eldrePeriode, eldrePeriodeUtenVersjon, eldreUberegnetPeriode] }),
        ],
    });
    const sisteFordeling = graderteAndreYtelser(arbeidsgiver.organisasjonsnummer);
    const fordelingIVersjonen = graderteAndreYtelser(arbeidsgiver.organisasjonsnummer);

    beforeEach(() => {
        (useGetGraderteAndreYtelser as Mock).mockReturnValue({
            data: [graderteAndreYtelser('999999999'), sisteFordeling],
        });
        (useGetGraderteAndreYtelserVersjon as Mock).mockImplementation((_personPseudoId: string, v: string | null) => ({
            data: v === versjon ? fordelingIVersjonen : undefined,
        }));
    });

    afterEach(() => vi.resetAllMocks());

    it('gir siste fordeling for inntektsforholdet i den gjeldende behandlingen', () => {
        const { result } = renderHook(() => useGraderteAndreYtelserForPeriode(gjeldendePeriode, arbeidsgiver));

        expect(result.current).toBe(sisteFordeling);
        expect(hentetVersjoner()).toEqual([null]);
    });

    it('gir fordelingen i versjonen en eldre behandling ble beregnet med', () => {
        const { result } = renderHook(() => useGraderteAndreYtelserForPeriode(eldrePeriode, arbeidsgiver));

        expect(result.current).toBe(fordelingIVersjonen);
        expect(hentetVersjoner()).toEqual([versjon]);
    });

    it('gir ingen fordeling for en eldre behandling uten versjon', () => {
        const { result } = renderHook(() => useGraderteAndreYtelserForPeriode(eldrePeriodeUtenVersjon, arbeidsgiver));

        expect(result.current).toBeUndefined();
        expect(hentetVersjoner()).toEqual([null]);
    });

    it('gir ingen fordeling for en uberegnet periode i en eldre behandling', () => {
        const { result } = renderHook(() => useGraderteAndreYtelserForPeriode(eldreUberegnetPeriode, arbeidsgiver));

        expect(result.current).toBeUndefined();
        expect(hentetVersjoner()).toEqual([null]);
    });
});

function hentetVersjoner(): (string | null)[] {
    return [...new Set((useGetGraderteAndreYtelserVersjon as Mock).mock.calls.map(([, v]) => v as string | null))];
}

function graderteAndreYtelser(organisasjonsnummer: string): ApiGraderteAndreYtelser {
    return {
        yrkesaktivitet: ApiYrkesaktivitetstype.ARBEIDSTAKER,
        organisasjonsnummer,
        versjon: generateId(),
        dager: [],
        events: [],
    };
}
