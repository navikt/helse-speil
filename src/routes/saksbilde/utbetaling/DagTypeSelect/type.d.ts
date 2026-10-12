import type { Speildag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';

export interface DagtypeSelectProps {
    name: string;
    erSelvstendig: boolean;
    className?: string;
    hideError?: boolean;
    overstyringsdagtyper: Speildag[];
}
