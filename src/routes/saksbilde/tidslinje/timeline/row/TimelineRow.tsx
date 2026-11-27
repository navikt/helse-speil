import { Dayjs } from 'dayjs';
import { PropsWithChildren, ReactElement } from 'react';

import { HStack, VStack } from '@navikt/ds-react';

import { ComponentWithType, ParsedRow, getNumberOfDays } from '@saksbilde/tidslinje/timeline';
import { useTimelineContext } from '@saksbilde/tidslinje/timeline/context';
import { TimelinePeriod } from '@saksbilde/tidslinje/timeline/period/TimelinePeriod';
import { useExpandedRows, useRowContext } from '@saksbilde/tidslinje/timeline/row/context';
import { ISO_DATOFORMAT, erHelg } from '@utils/date';
import { cn } from '@utils/tw';

import { PeriodContext } from '../period/context';

export interface TimelineRowProps extends PropsWithChildren {
    label: string;
    icon: ReactElement;
    copyLabelButton?: boolean;
    organisasjonsnummer?: string;
}

export const TimelineRow: ComponentWithType<TimelineRowProps> = (): ReactElement => {
    const { width } = useTimelineContext();
    const expandedRows = useExpandedRows();
    const { periods, generasjonPeriodsByLevel, rowIndex, totalRows } = useRowContext();
    const rowActive =
        totalRows > 1 &&
        (periods.some((p) => p.isActive) ||
            Array.from(generasjonPeriodsByLevel.values()).some((levelPeriods) => levelPeriods.some((p) => p.isActive)));

    return (
        <VStack
            data-tidslinjerad
            className={cn('my-3 bg-ax-bg-neutral-softA', { 'bg-ax-bg-accent-moderate': rowActive })}
            gap="space-8"
            style={{ width }}
        >
            <HStack className="relative h-[24px]">
                <SykefraværstilfelleRammer periods={periods} />
                {periods.map((period) => (
                    <PeriodContext.Provider key={period.id} value={{ periodId: period.id }}>
                        <TimelinePeriod
                            startDate={period.startDate}
                            endDate={period.endDate}
                            skjæringstidspunkt={period.skjæringstidspunkt}
                            icon={period.icon}
                            variant={period.variant}
                        />
                    </PeriodContext.Provider>
                ))}
            </HStack>

            {expandedRows.has(rowIndex) &&
                Array.from(generasjonPeriodsByLevel.entries()).map(([level, levelPeriods]) => (
                    <HStack key={`gen-level-${level}`} className="relative h-[24px]">
                        <SykefraværstilfelleRammer periods={levelPeriods} />
                        {levelPeriods.map((period) => (
                            <PeriodContext.Provider key={period.id} value={{ periodId: period.id }}>
                                <TimelinePeriod
                                    startDate={period.startDate}
                                    endDate={period.endDate}
                                    skjæringstidspunkt={period.skjæringstidspunkt}
                                    icon={period.icon}
                                    variant={period.variant}
                                />
                            </PeriodContext.Provider>
                        ))}
                    </HStack>
                ))}
        </VStack>
    );
};

TimelineRow.componentType = 'TimelineRow';

function SykefraværstilfelleRammer({ periods }: { periods: Period[] }): ReactElement {
    const { dayLength, endDate: timelineEnd } = useTimelineContext();

    return (
        <>
            {finnSammenhengendeSpenn(periods.filter((period) => period.erISykefraværstilfellet)).map(
                ({ startDate, endDate }) => (
                    <div
                        key={startDate.toISOString()}
                        data-sykefravaerstilfelle-ramme
                        aria-hidden
                        className="pointer-events-none absolute top-0 z-2 h-[24px] rounded-full border border-ax-border-accent-strong ring-1 inset-ring-1 ring-ax-border-accent-strong inset-ring-ax-border-accent-strong"
                        style={{
                            left: timelineEnd.diff(endDate, 'day') * dayLength,
                            width: getNumberOfDays(startDate, endDate) * dayLength,
                        }}
                    />
                ),
            )}
        </>
    );
}

type Period = ParsedRow['periods'][number];

type Spenn = { startDate: Dayjs; endDate: Dayjs };

function finnSammenhengendeSpenn(periods: Period[]): Spenn[] {
    const sortert = [...periods].sort((a, b) => a.startDate.diff(b.startDate));
    return sortert.reduce<Spenn[]>((spenn, period) => {
        const forrige = spenn.at(-1);
        if (forrige && liggerInntil(forrige.endDate, period.startDate)) {
            forrige.endDate = period.endDate;
        } else {
            spenn.push({ startDate: period.startDate, endDate: period.endDate });
        }
        return spenn;
    }, []);
}

function liggerInntil(forrigeSlutt: Dayjs, nesteStart: Dayjs): boolean {
    let dag = forrigeSlutt.add(1, 'day');
    while (dag.isBefore(nesteStart, 'day') && erHelg(dag.format(ISO_DATOFORMAT))) {
        dag = dag.add(1, 'day');
    }
    return dag.isSame(nesteStart, 'day');
}
