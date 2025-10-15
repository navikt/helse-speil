import { Dayjs } from 'dayjs';
import { useMemo } from 'react';

import { DatePeriod } from '@typer/shared';

export const useVisiblePeriods = <T extends DatePeriod>(end: Dayjs, start: Dayjs, periods: T[]): T[] =>
    useMemo(
        () => periods.filter((it) => end.isSameOrAfter(it.fom) && start.isSameOrBefore(it.tom)),
        [end, start, periods],
    );
