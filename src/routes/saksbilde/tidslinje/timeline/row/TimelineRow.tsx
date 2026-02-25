import React, { PropsWithChildren, ReactElement } from 'react';

import { HStack, VStack } from '@navikt/ds-react';

import { ComponentWithType } from '@saksbilde/tidslinje/timeline';
import { useTimelineContext } from '@saksbilde/tidslinje/timeline/context';
import { TimelinePeriod } from '@saksbilde/tidslinje/timeline/period/TimelinePeriod';
import { useExpandedRows, useRowContext } from '@saksbilde/tidslinje/timeline/row/context';
import { cn } from '@utils/tw';

import { PeriodContext } from '../period/context';

export interface TimelineRowProps extends PropsWithChildren {
    label: string;
    icon: ReactElement;
    copyLabelButton?: boolean;
    anonymized?: boolean;
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
            className={cn('my-3 bg-ax-bg-neutral-softA', { 'bg-ax-bg-accent-moderate': rowActive })}
            gap="space-8"
            style={{ width }}
        >
            <HStack className="relative h-[24px]">
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
