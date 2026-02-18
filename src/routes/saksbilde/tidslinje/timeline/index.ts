import dayjs, { Dayjs } from 'dayjs';
import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';

import { PeriodPins, TimelinePeriodProps, TimelineVariant } from '@saksbilde/tidslinje/timeline/period/TimelinePeriod';
import { TimelinePinProps } from '@saksbilde/tidslinje/timeline/pin/TimelinePin';
import { TimelineRowProps } from '@saksbilde/tidslinje/timeline/row/TimelineRow';

export interface ComponentWithType<P = unknown> extends React.FC<P> {
    componentType: string;
}

type Period = {
    id: string;
    children: ReactNode;
    isActive?: boolean;
    onSelectPeriod?: () => void;
    startDate: Dayjs;
    endDate: Dayjs;
    skjæringstidspunkt?: Dayjs;
    icon?: ReactElement;
    variant: TimelineVariant;
    cropLeft: boolean;
    cropRight: boolean;
    generasjonIndex: number;
    periodPins?: PeriodPins[];
};

export type RowLabels = {
    label: string;
    icon: ReactElement;
    rowIndex: number;
    generationLevels: number;
    copyLabelButton: boolean;
}[];

type ParsedRowsResult = {
    rowLabels: RowLabels;
    earliestDate: Dayjs;
    latestDate: Dayjs;
    parsedRows: ParsedRow[];
    zoomComponent: ReactNode;
    pins: ReactNode;
};

export function useParsedRows(children: ReactNode): ParsedRowsResult {
    const rowChildren: ReactElement<TimelineRowProps>[] = React.Children.toArray(children).filter(
        (child: ReactNode) =>
            React.isValidElement(child) && (child.type as ComponentWithType).componentType === 'TimelineRow',
    ) as ReactElement<TimelineRowProps>[];

    const pins: ReactElement<TimelinePinProps>[] = React.Children.toArray(children).filter(
        (child: ReactNode) =>
            React.isValidElement(child) && (child.type as ComponentWithType).componentType === 'TimelinePin',
    ) as ReactElement<TimelinePinProps>[];

    const zoomComponent: ReactElement<PropsWithChildren>[] = React.Children.toArray(children).filter(
        (child: ReactNode) =>
            React.isValidElement(child) && (child.type as ComponentWithType).componentType === 'TimelineZoom',
    ) as ReactElement<PropsWithChildren>[];

    const parsedRows = parseRows(rowChildren);

    const rowLabels = parsedRows.map((row, rowIndex) => {
        return {
            label: row.label,
            icon: row.icon,
            rowIndex,
            generationLevels: row.generasjonPeriodsByLevel?.size ?? 0,
            copyLabelButton: row.copyLabelButton,
        };
    });
    const allPeriods = parsedRows.map((row) => row.periods).flat();

    const earliestDate = useEarliestDate(allPeriods) ?? dayjs().subtract(1, 'year');
    const latestDate = useLatestDate(allPeriods) ?? dayjs().add(1, 'month');

    return { rowLabels, earliestDate, latestDate, parsedRows, zoomComponent, pins };
}

export type ParsedRow = {
    label: string;
    icon: ReactElement;
    periods: Period[];
    generasjonPeriodsByLevel: Map<number, Period[]>;
    copyLabelButton: boolean;
};

export function parseRows(rows: ReactElement<TimelineRowProps>[]): ParsedRow[] {
    const parsedRows: ParsedRow[] = [];

    rows.forEach((row, rowIndex) => {
        const periods: Period[] = [];
        const generasjonPeriodsByLevel: Map<number, Period[]> = new Map();

        const periodChildren: ReactElement<TimelinePeriodProps>[] = React.Children.toArray(row.props.children).filter(
            (child: ReactNode) =>
                React.isValidElement(child) && (child.type as ComponentWithType).componentType === 'TimelinePeriod',
        ) as ReactElement<TimelinePeriodProps>[];

        const sortedPeriods = periodChildren.sort((a, b) => b.props.startDate.diff(a.props.startDate));

        sortedPeriods.forEach((period, periodIndex) => {
            const startDate = period.props.startDate;
            const endDate = period.props.endDate;
            const skjæringstidspunkt = period.props.skjæringstidspunkt;
            const generasjonIndex = period.props.generasjonIndex ?? 0;
            const isGenerasjon = generasjonIndex > 0;

            const sameLevelPeriods = sortedPeriods.filter((p) => (p.props.generasjonIndex ?? 0) === generasjonIndex);
            const indexInSameLevel = sameLevelPeriods.findIndex((p) => p === period);

            const prevPeriod = sameLevelPeriods[indexInSameLevel - 1];
            const nextPeriod = sameLevelPeriods[indexInSameLevel + 1];

            const cropLeft = Boolean(
                prevPeriod?.props.startDate &&
                dayjs(endDate).add(1, 'day').isSame(prevPeriod.props.startDate, 'day') &&
                shouldCrop(skjæringstidspunkt, prevPeriod.props.skjæringstidspunkt),
            );

            const cropRight = Boolean(
                nextPeriod?.props.endDate &&
                dayjs(nextPeriod.props.endDate).add(1, 'day').isSame(startDate, 'day') &&
                shouldCrop(skjæringstidspunkt, nextPeriod.props.skjæringstidspunkt),
            );

            const parsedPeriod: Period = {
                id: `r-${rowIndex}-p-${periodIndex}`,
                children: period.props.children,
                isActive: period.props.activePeriod,
                onSelectPeriod: period.props.onSelectPeriod,
                icon: period.props.icon,
                variant: period.props.variant,
                startDate,
                endDate,
                skjæringstidspunkt,
                cropLeft,
                cropRight,
                generasjonIndex,
                periodPins: period.props.periodPins,
            };

            if (isGenerasjon) {
                if (!generasjonPeriodsByLevel.has(generasjonIndex)) {
                    generasjonPeriodsByLevel.set(generasjonIndex, []);
                }
                generasjonPeriodsByLevel.get(generasjonIndex)!.push(parsedPeriod);
            } else {
                periods.push(parsedPeriod);
            }
        });

        const sortedGenerasjonPeriodsByLevel = new Map(
            [...generasjonPeriodsByLevel.entries()].sort(([a], [b]) => a - b),
        );

        parsedRows.push({
            label: row.props?.label,
            icon: row.props?.icon,
            periods,
            generasjonPeriodsByLevel: sortedGenerasjonPeriodsByLevel,
            copyLabelButton: row.props?.copyLabelButton ?? false,
        });
    });

    return parsedRows;
}

function shouldCrop(thisSkjæringstidspunkt?: Dayjs, neighborSkjæringstidspunkt?: Dayjs): boolean {
    return (
        !!thisSkjæringstidspunkt &&
        !!neighborSkjæringstidspunkt &&
        thisSkjæringstidspunkt.isSame(neighborSkjæringstidspunkt)
    );
}

export const getNumberOfDays = (start: Dayjs, end: Dayjs): number => end.diff(start, 'day') + 1;

function useEarliestDate(periods: ParsedRow['periods']): Dayjs | undefined {
    const dates = periods.filter((period) => period.startDate).map((period) => period.startDate);

    if (dates.length === 0) return undefined;

    return dates.reduce((earliestDate, currentDate) =>
        currentDate.isBefore(earliestDate) ? currentDate : earliestDate,
    );
}

function useLatestDate(periods: ParsedRow['periods']): Dayjs | undefined {
    const dates = periods.filter((period) => period.endDate).map((period) => period.endDate);

    if (dates.length === 0) return undefined;

    return dates.reduce((latestDate, currentDate) => (currentDate.isAfter(latestDate) ? currentDate : latestDate));
}
