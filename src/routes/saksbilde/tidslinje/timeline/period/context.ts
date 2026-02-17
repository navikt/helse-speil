import { createContext, useContext } from 'react';

type PeriodContextType = {
    periodId: string;
};

export const PeriodContext = createContext<PeriodContextType | null>(null);

export function usePeriodContext(): PeriodContextType {
    const context = useContext(PeriodContext);
    if (!context) {
        throw new Error('usePeriodContext must be used within a PeriodContext.Provider');
    }
    return context;
}
