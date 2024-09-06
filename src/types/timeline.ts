import { Dayjs } from 'dayjs';

import {
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    NyttInntektsforholdPeriodeFragment,
    UberegnetPeriodeFragment,
} from '@io/graphql';

import { DatePeriod, InfotrygdPeriod } from './shared';

export type TimelineZoomLevel = {
    fom: Dayjs;
    tom: Dayjs;
    label: string;
};

export type TimelinePeriod = (
    | NyttInntektsforholdPeriodeFragment
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
