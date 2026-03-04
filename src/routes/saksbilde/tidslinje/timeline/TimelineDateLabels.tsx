import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { HStack } from '@navikt/ds-react';

import { useTimelineContext } from '@saksbilde/tidslinje/timeline/context';

export function TimelineDateLabels(): ReactElement {
    const { startDate, endDate, width, dayLength, zoomLevel } = useTimelineContext();

    const showYears = zoomLevel.includes('år');
    const dateLabels = generateLabelsBetween(startDate, endDate, showYears);

    const estimatedLabelWidth = showYears ? 29 : 47;

    return (
        <HStack className="relative h-[24px] text-ax-medium text-ax-text-neutral-subtle" style={{ width }}>
            {dateLabels.map((date, i) => {
                const daysFromEnd = endDate.diff(date, 'day');
                const placement = daysFromEnd * dayLength;

                if (placement > width) return null;

                const wouldOverflow = placement - estimatedLabelWidth < 0;
                const left = wouldOverflow ? 0 : placement;
                const transform = wouldOverflow ? undefined : 'translateX(-100%)';

                return (
                    <span key={i} className="absolute whitespace-nowrap" style={{ left, transform }}>
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
