import React from 'react';

import type { BeregnetPeriode, GhostPeriode, Periode } from '@io/graphql';

import { Period } from './Period';
import { usePeriodStyling } from './usePeriodStyling';
import { useVisiblePeriods } from './useVisiblePeriods';

import styles from './Periods.module.css';

const byFomAscending = (a: DatePeriod, b: DatePeriod) => new Date(b.fom).getTime() - new Date(a.fom).getTime();

const filterActivePeriods = (periods: Array<Periode>): Array<Periode> =>
    periods.filter((it) => !(it.erForkastet && it.behandlingstype === 'VENTER'));

interface PeriodsProps {
    start: Dayjs;
    end: Dayjs;
    periods: Array<Periode>;
    infotrygdPeriods?: Array<InfotrygdPeriod>;
    ghostPeriods?: Array<GhostPeriode>;
    notCurrent?: boolean;
    activePeriodId?: string | null;
}

export const Periods: React.VFC<PeriodsProps> = React.memo(
    ({ start, end, periods, infotrygdPeriods, ghostPeriods, notCurrent, activePeriodId }) => {
        const allPeriods = [...filterActivePeriods(periods), ...(infotrygdPeriods ?? []), ...(ghostPeriods ?? [])].sort(
            byFomAscending
        );
        const visiblePeriods = useVisiblePeriods(start, allPeriods);
        const positions = usePeriodStyling(start, end, visiblePeriods);

        return (
            <div className={styles.Periods}>
                {visiblePeriods.map((period, i) => (
                    <Period
                        key={i}
                        period={period}
                        style={positions.get(i) ?? {}}
                        notCurrent={notCurrent}
                        isActive={
                            typeof activePeriodId === 'string' && activePeriodId === (period as BeregnetPeriode).id
                        }
                    />
                ))}
            </div>
        );
    }
);
