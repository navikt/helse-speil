import { useMemo } from 'react';

export const useVisiblePeriods = <T extends DatePeriod>(end: Dayjs, start: Dayjs, periods: Array<T>): Array<T> =>
    useMemo(
        () => periods.filter((it) => end.isSameOrAfter(it.fom) && start.isSameOrBefore(it.tom)),
        [end, start, periods],
    );
