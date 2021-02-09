import { Dayjs } from 'dayjs';
import { PositionedPeriod } from '@navikt/helse-frontend-timeline/lib';
import { Vedtaksperiodetilstand } from 'internal-types';
import { ReactNode } from 'react';

export interface Tidslinjeutsnitt {
    fom: Dayjs;
    tom: Dayjs;
    label: string;
}

export type TidslinjeperiodeObject = PositionedPeriod & {
    tilstand: Vedtaksperiodetilstand;
    hoverLabel?: ReactNode;
    skalVisePin: boolean;
};
