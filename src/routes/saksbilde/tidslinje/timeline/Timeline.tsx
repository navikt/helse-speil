import React, { PropsWithChildren, ReactElement } from 'react';

import { HStack, VStack } from '@navikt/ds-react';

import { TimelineRowLabels } from '@saksbilde/tidslinje/timeline/TimelineRowLabels';
import { TimelineScrollableRows } from '@saksbilde/tidslinje/timeline/TimelineScrollableRows';
import { useParsedRows } from '@saksbilde/tidslinje/timeline/index';
import { TimelineRow } from '@saksbilde/tidslinje/timeline/row/TimelineRow';
import {
    TimelineZoomOptions,
    useExpandableRows,
    useScrollToActivePeriod,
    useTimelineState,
} from '@saksbilde/tidslinje/timeline/state';

import { TimelineContext } from './context';
import { ExpandedRowsContext, RowContext, ToggleRowContext } from './row/context';

type TimelineProps = PropsWithChildren<TimelineZoomOptions>;

export function Timeline({ children, zoomLevel, onZoomLevelChange, defaultZoomLevel }: TimelineProps): ReactElement {
    const { rowLabels, earliestDate, latestDate, parsedRows, zoomComponent, pins } = useParsedRows(children);
    const { expandedRows, toggleRowExpanded } = useExpandableRows();
    const {
        startDate,
        endDate,
        width,
        dayLength,
        zoomLevel: resolvedZoomLevel,
        setZoomLevel,
        setZoomSpanInDays,
        timelineScrollableContainerRef,
    } = useTimelineState(earliestDate, latestDate, { zoomLevel, onZoomLevelChange, defaultZoomLevel });

    useScrollToActivePeriod(timelineScrollableContainerRef, width, resolvedZoomLevel);

    return (
        <TimelineContext.Provider
            value={{
                startDate,
                endDate,
                width,
                dayLength,
                zoomLevel: resolvedZoomLevel,
                setZoomLevel,
                setZoomSpanInDays,
            }}
        >
            <ExpandedRowsContext.Provider value={expandedRows}>
                <ToggleRowContext.Provider value={toggleRowExpanded}>
                    <VStack
                        gap="space-16"
                        className="ignore-axe w-full border-b border-ax-border-neutral-subtle px-6 pt-8 pb-4"
                    >
                        <HStack gap="space-16" wrap={false}>
                            <TimelineRowLabels labels={rowLabels} />
                            <TimelineScrollableRows ref={timelineScrollableContainerRef}>
                                {pins}
                                {parsedRows.map((row, rowIndex) => (
                                    <RowContext.Provider
                                        key={rowIndex}
                                        value={{
                                            periods: row.periods,
                                            generasjonPeriodsByLevel: row.generasjonPeriodsByLevel,
                                            allPeriods: [
                                                ...row.periods,
                                                ...Array.from(row.generasjonPeriodsByLevel.values()).flat(),
                                            ],
                                            rowIndex,
                                            totalRows: parsedRows.length,
                                        }}
                                    >
                                        <TimelineRow label={row.label} icon={row.icon} />
                                    </RowContext.Provider>
                                ))}
                            </TimelineScrollableRows>
                        </HStack>
                        {zoomComponent}
                    </VStack>
                </ToggleRowContext.Provider>
            </ExpandedRowsContext.Provider>
        </TimelineContext.Provider>
    );
}
