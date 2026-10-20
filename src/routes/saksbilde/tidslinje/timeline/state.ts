import { Dayjs } from 'dayjs';
import { RefObject, useEffect, useRef, useState } from 'react';

import { ParsedRow, getNumberOfDays } from '@saksbilde/tidslinje/timeline/index';
import { ZoomLevel, zoomLevels } from '@saksbilde/tidslinje/timeline/zoom/TimelineZoom';

export interface TimelineZoomOptions {
    zoomLevel?: ZoomLevel;
    onZoomLevelChange?: (level: ZoomLevel) => void;
    defaultZoomLevel?: ZoomLevel;
}

export function useTimelineState(earliestDate: Dayjs, latestDate: Dayjs, zoomOptions?: TimelineZoomOptions) {
    const timelineScrollableContainerRef = useRef<HTMLDivElement>(null);

    const [internalZoomLevel, setInternalZoomLevel] = useState<ZoomLevel>(zoomOptions?.defaultZoomLevel ?? '6 mnd');

    const zoomLevel = zoomOptions?.zoomLevel ?? internalZoomLevel;
    const setZoomLevel = (level: ZoomLevel) => {
        if (zoomOptions?.zoomLevel === undefined) setInternalZoomLevel(level);
        zoomOptions?.onZoomLevelChange?.(level);
    };

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

export function useExpandableRows(parsedRows: ParsedRow[]) {
    const aktivHistoriskPeriode = finnAktivHistoriskPeriode(parsedRows);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(() =>
        aktivHistoriskPeriode === null ? new Set() : new Set([aktivHistoriskPeriode.rowIndex]),
    );
    const [prevAktivHistoriskPeriodeId, setPrevAktivHistoriskPeriodeId] = useState(
        aktivHistoriskPeriode?.periodId ?? null,
    );

    // Justeres under render så den aktive historiske perioden finnes i DOM-en før scroll-til-aktiv-periode kjører
    const aktivHistoriskPeriodeId = aktivHistoriskPeriode?.periodId ?? null;
    if (aktivHistoriskPeriodeId !== prevAktivHistoriskPeriodeId) {
        setPrevAktivHistoriskPeriodeId(aktivHistoriskPeriodeId);
        if (aktivHistoriskPeriode !== null && !expandedRows.has(aktivHistoriskPeriode.rowIndex)) {
            setExpandedRows(new Set(expandedRows).add(aktivHistoriskPeriode.rowIndex));
        }
    }

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

function finnAktivHistoriskPeriode(parsedRows: ParsedRow[]): { rowIndex: number; periodId: string } | null {
    for (const [rowIndex, row] of parsedRows.entries()) {
        for (const periods of row.generasjonPeriodsByLevel.values()) {
            const aktiv = periods.find((period) => period.isActive);
            if (aktiv) return { rowIndex, periodId: aktiv.id };
        }
    }
    return null;
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
