import { Dayjs } from 'dayjs';

import { DatePeriod } from '@typer/shared';

export function useVisiblePeriods<T extends DatePeriod>(end: Dayjs, start: Dayjs, periods: T[]): T[] {
    return periods.filter((it) => end.isSameOrAfter(it.fom) && start.isSameOrBefore(it.tom));
}
