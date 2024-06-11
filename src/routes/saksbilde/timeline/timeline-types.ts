import { Dayjs } from 'dayjs';

import { BeregnetPeriodeFragment, GhostPeriodeFragment, UberegnetPeriodeFragment } from '@/io/graphql';
import { DatePeriod, InfotrygdPeriod } from '@/types/shared';

export type TimelineZoomLevel = {
    fom: Dayjs;
    tom: Dayjs;
    label: string;
};

export type TimelinePeriod = (
    | GhostPeriodeFragment
    | BeregnetPeriodeFragment
    | UberegnetPeriodeFragment
    | InfotrygdPeriod
    | DatePeriod
) & {
    isFirst?: boolean;
    hasLeftNeighbour?: boolean;
    hasRightNeighbour?: boolean;
};
