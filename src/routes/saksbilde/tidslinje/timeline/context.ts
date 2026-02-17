import { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, createContext, useContext } from 'react';

import { ZoomLevel } from '@saksbilde/tidslinje/timeline/zoom/TimelineZoom';

type TimelineContextType = {
    startDate: Dayjs;
    endDate: Dayjs;
    width: number;
    dayLength: number;
    zoomLevel: ZoomLevel;
    setZoomLevel: Dispatch<SetStateAction<ZoomLevel>>;
    setZoomSpanInDays: Dispatch<SetStateAction<number>>;
};

export const TimelineContext = createContext<TimelineContextType | null>(null);

export function useTimelineContext(): TimelineContextType {
    const context = useContext(TimelineContext);
    if (!context) {
        throw new Error('useTimelineContext must be used within a TimelineContext.Provider');
    }
    return context;
}
