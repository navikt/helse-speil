import { PropsWithChildren, ReactElement } from 'react';

import { ToggleGroup } from '@navikt/ds-react';
import { ToggleGroupItem } from '@navikt/ds-react/ToggleGroup';

import { ComponentWithType } from '@saksbilde/tidslinje/timeline';
import { useTimelineContext } from '@saksbilde/tidslinje/timeline/context';

export type ZoomLevel = '2 mnd' | '6 mnd' | '1 år' | '4 år';

export type ZoomLevels = Record<ZoomLevel, number>;

export const zoomLevels: ZoomLevels = {
    '2 mnd': 60,
    '6 mnd': 180,
    '1 år': 365,
    '4 år': 365 * 4,
};

export const TimelineZoom: ComponentWithType<PropsWithChildren> = (): ReactElement => {
    const { zoomLevel, setZoomLevel, setZoomSpanInDays } = useTimelineContext();

    return (
        <ToggleGroup
            data-color="neutral"
            size="small"
            value={zoomLevel}
            onChange={(value) => {
                setZoomLevel(value as ZoomLevel);
                setZoomSpanInDays(zoomLevels[value as ZoomLevel]);
            }}
            className="self-end"
        >
            {(Object.keys(zoomLevels) as ZoomLevel[]).map((label) => (
                <ToggleGroupItem key={label} value={label} label={label} />
            ))}
        </ToggleGroup>
    );
};

TimelineZoom.componentType = 'TimelineZoom';
