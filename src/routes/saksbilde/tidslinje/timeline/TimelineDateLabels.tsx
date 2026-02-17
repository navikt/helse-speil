import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { HStack } from '@navikt/ds-react';

import { useTimelineContext } from '@saksbilde/tidslinje/timeline/context';

export function TimelineDateLabels(): ReactElement {
    const { startDate, endDate, width, dayLength, zoomLevel } = useTimelineContext();

    const showYears = zoomLevel.includes('år');
    const dateLabels = generateLabelsBetween(startDate, endDate, showYears);

    return (
        <HStack className="relative h-[20px] text-ax-medium text-ax-text-neutral-subtle" style={{ width }}>
            {dateLabels.map((date, i) => {
                const daysFromEnd = endDate.diff(date, 'day');
                const placement = daysFromEnd * dayLength;

                return (
                    <span key={i} className="absolute -translate-x-full whitespace-nowrap" style={{ left: placement }}>
                        {date.format(showYears ? 'YYYY' : 'MMM YY')}
                    </span>
                );
            })}
        </HStack>
    );
}

function generateLabelsBetween(start: Dayjs, end: Dayjs, showYears: boolean): Dayjs[] {
    const labels: Dayjs[] = [];
    const increment = showYears ? 'year' : 'month';

    let current = showYears ? end.startOf('year') : end.startOf('month');

    while (current.isSameOrAfter(start)) {
        labels.push(current);
        current = current.subtract(1, increment);
    }

    return labels;
}
