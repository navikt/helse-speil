import { Dayjs } from 'dayjs';
import React, { PropsWithChildren, ReactElement, RefObject, useEffect, useRef, useState } from 'react';

import { Popover } from '@navikt/ds-react';
import { PopoverContent } from '@navikt/ds-react/Popover';

import { ComponentWithType, getNumberOfDays } from '@saksbilde/tidslinje/timeline';
import { useTimelineContext } from '@saksbilde/tidslinje/timeline/context';
import { usePeriodContext } from '@saksbilde/tidslinje/timeline/period/context';
import { usePopoverAnchor } from '@saksbilde/tidslinje/timeline/period/usePopoverAnchor';
import { useRowContext } from '@saksbilde/tidslinje/timeline/row/context';
import { cn } from '@utils/tw';

export type TimelineVariant =
    | 'behandles'
    | 'godkjent'
    | 'ventende'
    | 'ingen_utbetaling'
    | 'ghost'
    | 'tilkommen_inntekt'
    | 'historisk'
    | 'infotrygd'
    | 'forkastet';

export interface TimelinePeriodProps extends PropsWithChildren {
    startDate: Dayjs;
    endDate: Dayjs;
    skjæringstidspunkt?: Dayjs;
    activePeriod?: boolean;
    onSelectPeriod?: () => void;
    icon?: ReactElement;
    variant: TimelineVariant;
    generasjonIndex?: number;
}

export const TimelinePeriod: ComponentWithType<TimelinePeriodProps> = (): ReactElement => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { onMouseOver, onMouseOut, anchorEl, open, onClose } = usePopoverAnchor();
    const { dayLength, endDate: timelineEnd } = useTimelineContext();
    const { allPeriods } = useRowContext();
    const { periodId } = usePeriodContext();
    const showIcon = useIsWiderThan(buttonRef, 32);

    const period = allPeriods.find((p) => p.id === periodId);

    if (!period) return <></>;

    const { startDate, endDate, cropLeft, cropRight, isActive, onSelectPeriod, icon, variant, children } = period;

    // TODO ordne bredde og plassering et annet sted
    const width = getNumberOfDays(startDate, endDate) * dayLength;
    const daysFromEnd = timelineEnd.diff(endDate, 'day');
    const placement = daysFromEnd * dayLength;

    return (
        <>
            <button
                data-period-variant={variant}
                className={cn(
                    'aksel-timeline__period--clickable aksel-timeline__period absolute h-[24px] rounded-full',
                    {
                        'rounded-l-none': cropLeft,
                        'rounded-r-none': cropRight,
                        'z-3 border border-ax-border-accent-strong ring-1 inset-ring-1 ring-ax-border-accent-strong inset-ring-ax-border-accent-strong':
                            isActive,
                    },
                )}
                style={{ left: placement, width }}
                ref={buttonRef}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={() => onSelectPeriod?.()}
            >
                {showIcon && <span className={cn('aksel-timeline__period--inner')}>{icon}</span>}
            </button>
            <Popover strategy="fixed" anchorEl={anchorEl} open={open} onClose={onClose}>
                <PopoverContent>{children}</PopoverContent>
            </Popover>
        </>
    );
};

TimelinePeriod.componentType = 'TimelinePeriod';

const useIsWiderThan = (ref: RefObject<HTMLElement | null>, targetWidth: number) => {
    const [isWider, setIsWider] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setIsWider(entry.contentRect.width >= targetWidth);
            }
        });

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref, targetWidth]);

    return isWider;
};
