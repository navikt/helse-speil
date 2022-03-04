import { Dayjs } from 'dayjs';
import { ReactNode } from 'react';

import { PositionedPeriod } from '@navikt/helse-frontend-timeline/lib';

export interface Tidslinjeutsnitt {
    fom: Dayjs;
    tom: Dayjs;
    label: string;
}

export type TidslinjeperiodeObject = PositionedPeriod & {
    tilstand: Tidslinjetilstand;
    periodetype: Periodetype;
    hoverLabel?: ReactNode;
    skalVisePin: boolean;
};
