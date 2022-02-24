import { useMemo } from 'react';

export const useVisiblePeriods = <T extends DatePeriod>(start: Dayjs, periods: Array<T>): Array<T> =>
    useMemo(() => periods.filter((it) => start.isSameOrBefore(it.tom)), [start, periods]);
