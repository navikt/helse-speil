import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiEgenskap } from '@io/rest/generated/spesialist.schemas';
import { TabType, tabState } from '@oversikt/tabState';
import { FilterStatus, hydrateFilters } from '@oversikt/table/state/filter';
import { renderHook } from '@test-utils';

import { useOppgaveFeed } from './oppgaver';

const useGetOppgaverMock = vi.fn((_params: Record<string, unknown>) => ({
    data: undefined,
    error: null,
    isFetching: false,
}));

vi.mock('@io/rest/generated/oppgaver/oppgaver', () => ({
    useGetOppgaver: (params: Record<string, unknown>) => useGetOppgaverMock(params),
    useGetAntallOppgaver: () => ({ data: undefined }),
    getGetOppgaverQueryKey: () => ['oppgaver'],
    getGetAntallOppgaverQueryKey: () => ['antallOppgaver'],
}));

describe('useOppgaveFeed', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        useGetOppgaverMock.mockClear();
    });

    it('ignorerer lagrede Tildelt- og På vent-filtre på Mine oppgaver', () => {
        lagreFiltre(TabType.Mine);

        renderHook(() => useOppgaveFeed(), {
            atomValues: [[tabState, TabType.Mine], hydrateFilters()],
        });

        const params = sisteKall();
        expect(params.erTildelt).toBeUndefined();
        expect(params.erPaaVent).toBe(false);
        expect(params.ingenAvEgenskapene).toBeUndefined();
        expect(params.minstEnAvEgenskapene).toEqual([ApiEgenskap.UTBETALING_TIL_ARBEIDSGIVER]);
    });

    it('sender Tildelt- og På vent-filtre på Til godkjenning', () => {
        lagreFiltre(TabType.TilGodkjenning);

        renderHook(() => useOppgaveFeed(), {
            atomValues: [[tabState, TabType.TilGodkjenning], hydrateFilters()],
        });

        const params = sisteKall();
        expect(params.erTildelt).toBe(false);
        expect(params.ingenAvEgenskapene).toBe(ApiEgenskap.PA_VENT);
    });
});

function lagreFiltre(tab: TabType) {
    localStorage.setItem(
        'filtersPerTab',
        JSON.stringify({
            [TabType.TilGodkjenning]: [],
            [TabType.Mine]: [],
            [TabType.Ventende]: [],
            [tab]: [
                { key: 'TILDELTE_SAKER', status: FilterStatus.MINUS },
                { key: ApiEgenskap.PA_VENT, status: FilterStatus.MINUS },
                { key: ApiEgenskap.UTBETALING_TIL_ARBEIDSGIVER, status: FilterStatus.PLUS },
            ],
        }),
    );
}

function sisteKall() {
    return useGetOppgaverMock.mock.calls.at(-1)![0];
}
