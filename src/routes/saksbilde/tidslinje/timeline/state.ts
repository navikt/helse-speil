import { Dayjs } from 'dayjs';
import { RefObject, useEffect, useRef, useState } from 'react';

import { getNumberOfDays } from '@saksbilde/tidslinje/timeline/index';
import { ZoomLevel, zoomLevels } from '@saksbilde/tidslinje/timeline/zoom/TimelineZoom';

export function useTimelineState(earliestDate: Dayjs, latestDate: Dayjs) {
    const timelineScrollableContainerRef = useRef<HTMLDivElement>(null);
    const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('6 mnd');
    const [zoomSpanInDays, setZoomSpanInDays] = useState<number>(zoomLevels[zoomLevel]);

    const containerWidth = useResizeObserver(timelineScrollableContainerRef);

    const pxPerDay = containerWidth ? containerWidth / zoomSpanInDays : 0;
    const numberOfDaysBetweenPeriods = getNumberOfDays(earliestDate, latestDate);
    const timelineStartDate = latestDate.subtract(zoomSpanInDays - 1, 'day');

    const fitsInContainer = containerWidth ? containerWidth > numberOfDaysBetweenPeriods * pxPerDay : false;

    const startDate = fitsInContainer ? timelineStartDate : earliestDate;

    const numberOfDaysInTimeline = fitsInContainer
        ? getNumberOfDays(timelineStartDate, latestDate)
        : numberOfDaysBetweenPeriods;

    const dayLength = pxPerDay;
    const width = numberOfDaysInTimeline * pxPerDay;

    return {
        startDate,
        endDate: latestDate,
        width,
        dayLength,
        zoomLevel,
        setZoomLevel,
        setZoomSpanInDays,
        timelineScrollableContainerRef,
    };
}

function useResizeObserver(ref: RefObject<HTMLElement | null>) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setWidth(entry.contentRect.width);
            }
        });

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [ref]);

    return width;
}

export function useExpandableRows() {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    function toggleRowExpanded(rowIndex: number) {
        setExpandedRows((prev) => {
            const next = new Set(prev);
            if (next.has(rowIndex)) {
                next.delete(rowIndex);
            } else {
                next.add(rowIndex);
            }
            return next;
        });
    }

    return { expandedRows, toggleRowExpanded };
}

export function useScrollToActivePeriod(
    containerRef: RefObject<HTMLDivElement | null>,
    width: number,
    zoomLevel: ZoomLevel,
) {
    const hasScrolledInitially = useRef(false);

    // Scroll active period into view on initial render (once layout is ready)
    useEffect(() => {
        if (hasScrolledInitially.current || !width) return;

        const activePeriod = containerRef.current?.querySelector<HTMLElement>('[data-active-period]');
        if (!activePeriod) return;

        requestAnimationFrame(() => {
            activePeriod.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' });
        });
        hasScrolledInitially.current = true;
    }, [containerRef, width]);

    // Scroll active period into view when zoom level changes
    useEffect(() => {
        if (!hasScrolledInitially.current) return;

        const activePeriod = containerRef.current?.querySelector<HTMLElement>('[data-active-period]');
        if (!activePeriod) return;

        requestAnimationFrame(() => {
            activePeriod.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' });
        });
    }, [containerRef, zoomLevel]);
}
