import { createContext, useContext } from 'react';

import { ParsedRow } from '@saksbilde/tidslinje/timeline';

type RowContextType = {
    periods: ParsedRow['periods'];
    allPeriods: ParsedRow['periods'];
    generasjonPeriodsByLevel: Map<number, ParsedRow['periods']>;
    rowIndex: number;
};

const RowContext = createContext<RowContextType | null>(null);
const ExpandedRowsContext = createContext<Set<number> | null>(null);
const ToggleRowContext = createContext<((index: number) => void) | null>(null);

export function useRowContext(): RowContextType {
    const context = useContext(RowContext);
    if (!context) {
        throw new Error('useRowContext must be used within a RowContext.Provider');
    }
    return context;
}

export function useExpandedRows(): Set<number> {
    const context = useContext(ExpandedRowsContext);
    if (!context) {
        throw new Error('useExpandedRows must be used within an ExpandedRowsContext.Provider');
    }
    return context;
}

export function useToggleRow(): (index: number) => void {
    const context = useContext(ToggleRowContext);
    if (!context) {
        throw new Error('useToggleRow must be used within a ToggleRowContext.Provider');
    }
    return context;
}

export { RowContext, ExpandedRowsContext, ToggleRowContext };
