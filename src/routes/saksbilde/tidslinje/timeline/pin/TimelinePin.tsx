import { Dayjs } from 'dayjs';
import { PropsWithChildren, ReactElement } from 'react';

import { Popover } from '@navikt/ds-react';
import { PopoverContent } from '@navikt/ds-react/Popover';

import { ComponentWithType } from '@saksbilde/tidslinje/timeline';
import { useTimelineContext } from '@saksbilde/tidslinje/timeline/context';
import { usePopoverAnchor } from '@saksbilde/tidslinje/timeline/period/usePopoverAnchor';

export interface TimelinePinProps extends PropsWithChildren {
    date: Dayjs;
}

export const TimelinePin: ComponentWithType<TimelinePinProps> = ({
    date,
    children,
    ...restProps
}): ReactElement | null => {
    const { dayLength, startDate, endDate } = useTimelineContext();
    const { onMouseOver, onMouseOut, toggle, hide, anchorEl, open, onClose } = usePopoverAnchor();

    if (date.isBefore(startDate) || date.isAfter(endDate)) return null;
    const daysFromEnd = endDate.diff(date, 'day');
    const placement = daysFromEnd * dayLength;

    return (
        <div className="aksel-timeline__pin-wrapper" style={{ left: placement }}>
            <button
                {...restProps}
                className="aksel-timeline__pin-button"
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onBlur={hide}
                onFocus={(e) => toggle(e.currentTarget)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        toggle(e.currentTarget);
                    } else if (e.key === ' ') {
                        hide();
                    }
                }}
            />
            <Popover strategy="fixed" anchorEl={anchorEl} open={open} onClose={onClose}>
                <PopoverContent>{children}</PopoverContent>
            </Popover>
        </div>
    );
};

TimelinePin.componentType = 'TimelinePin';
