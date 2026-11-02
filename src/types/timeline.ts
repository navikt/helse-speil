import { ApiBeregnetPeriode, ApiGhostPeriode, ApiUberegnetPeriode } from '@io/rest/generated/spesialist.schemas';

import { DatePeriod, InfotrygdPeriod } from './shared';

export type TimelinePeriod = (
    ApiGhostPeriode | ApiBeregnetPeriode | ApiUberegnetPeriode | InfotrygdPeriod | DatePeriod
) & {
    isFirst?: boolean;
    hasLeftNeighbour?: boolean;
    hasRightNeighbour?: boolean;
};
