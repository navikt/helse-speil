import { useAtom } from 'jotai';

import { TabType, tabState } from '@oversikt/tabState';
import { act, renderHook } from '@test-utils';

import { useCurrentPageState, useResetToFirstPageOnHashChange } from './pagination';

describe('useResetToFirstPageOnHashChange', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    it('nullstiller siden på fanen hashen ble regnet ut for, selv om aktiv fane er en annen', () => {
        const { result } = renderHook(() => ({
            tab: useAtom(tabState),
            side: useCurrentPageState(),
            reset: useResetToFirstPageOnHashChange(),
        }));

        act(() => result.current.tab[1](TabType.Mine));
        act(() => result.current.reset(TabType.Mine, 'mine-hash'));
        act(() => result.current.side[1](3));

        act(() => result.current.reset(TabType.TilGodkjenning, 'til-godkjenning-hash'));

        expect(result.current.side[0]).toBe(3);
    });

    it('nullstiller til første side når hashen endres', () => {
        const { result } = renderHook(() => ({
            side: useCurrentPageState(),
            reset: useResetToFirstPageOnHashChange(),
        }));

        act(() => result.current.reset(TabType.TilGodkjenning, 'hash-1'));
        act(() => result.current.side[1](2));
        act(() => result.current.reset(TabType.TilGodkjenning, 'hash-1'));
        expect(result.current.side[0]).toBe(2);

        act(() => result.current.reset(TabType.TilGodkjenning, 'hash-2'));
        expect(result.current.side[0]).toBe(1);
    });
});
