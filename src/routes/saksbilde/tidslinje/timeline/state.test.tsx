import dayjs from 'dayjs';
import React from 'react';

import { ParsedRow } from '@saksbilde/tidslinje/timeline/index';
import { useExpandableRows } from '@saksbilde/tidslinje/timeline/state';
import { act, renderHook } from '@test-utils';

describe('useExpandableRows', () => {
    it('ekspanderer ikke rader når aktiv periode er i nyeste behandling', () => {
        const rows = [enRad({ aktivNyeste: true }), enRad()];
        const { result } = renderHook(() => useExpandableRows(rows));
        expect(result.current.expandedRows.size).toBe(0);
    });

    it('ekspanderer raden med aktiv historisk periode ved første render', () => {
        const rows = [enRad(), enRad({ aktivHistorisk: true })];
        const { result } = renderHook(() => useExpandableRows(rows));
        expect([...result.current.expandedRows]).toEqual([1]);
    });

    it('ekspanderer raden når aktiv historisk periode dukker opp senere', () => {
        const { result, rerender } = renderHook(({ rows }) => useExpandableRows(rows), {
            initialProps: { rows: [enRad(), enRad()] },
        });
        expect(result.current.expandedRows.size).toBe(0);

        rerender({ rows: [enRad({ aktivHistorisk: true }), enRad()] });
        expect([...result.current.expandedRows]).toEqual([0]);
    });

    it('lar brukeren lukke raden igjen', () => {
        const rows = [enRad({ aktivHistorisk: true })];
        const { result, rerender } = renderHook(() => useExpandableRows(rows));

        act(() => result.current.toggleRowExpanded(0));
        rerender();
        expect(result.current.expandedRows.size).toBe(0);
    });

    it('åpner lukket rad igjen når en annen historisk periode i samme rad blir aktiv', () => {
        const { result, rerender } = renderHook(({ rows }) => useExpandableRows(rows), {
            initialProps: { rows: [enRad({ aktivHistorisk: true })] },
        });

        act(() => result.current.toggleRowExpanded(0));
        rerender({ rows: [enRad({ aktivHistorisk: true })] });
        expect(result.current.expandedRows.size).toBe(0);

        rerender({ rows: [enRad({ aktivEldreHistorisk: true })] });
        expect([...result.current.expandedRows]).toEqual([0]);
    });
});

function enRad({ aktivNyeste = false, aktivHistorisk = false, aktivEldreHistorisk = false } = {}): ParsedRow {
    return {
        label: 'Arbeidsgiver',
        icon: <span />,
        periods: [enPeriode('nyeste', aktivNyeste, 0)],
        generasjonPeriodsByLevel: new Map([
            [1, [enPeriode('historisk', aktivHistorisk, 1)]],
            [2, [enPeriode('eldre-historisk', aktivEldreHistorisk, 2)]],
        ]),
        copyLabelButton: false,
    };
}

function enPeriode(id: string, isActive: boolean, generasjonIndex: number): ParsedRow['periods'][number] {
    return {
        id,
        children: null,
        isActive,
        startDate: dayjs('2025-01-01'),
        endDate: dayjs('2025-01-31'),
        variant: 'utbetalt' as ParsedRow['periods'][number]['variant'],
        cropLeft: false,
        cropRight: false,
        generasjonIndex,
    };
}
