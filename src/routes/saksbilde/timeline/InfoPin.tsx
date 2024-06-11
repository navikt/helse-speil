import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { DatePeriod } from '@/types/shared';
import { Sykdomsdagtype, Utbetalingsdagtype } from '@io/graphql';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

import styles from './InfoPin.module.css';

const shouldShowInfoPin = (period: DatePeriod): boolean => {
    if (!isBeregnetPeriode(period)) return false;

    return period.tidslinje.some(
        (dag) =>
            ![Utbetalingsdagtype.Helgedag, Utbetalingsdagtype.Navdag, Utbetalingsdagtype.Navhelgdag].includes(
                dag.utbetalingsdagtype,
            ) || [Sykdomsdagtype.Permisjonsdag].includes(dag.sykdomsdagtype),
    );
};

const shouldShowNotatPin = (period: DatePeriod): boolean => {
    if (!isBeregnetPeriode(period) && !isUberegnetPeriode(period)) return false;

    return period.notater.some((notat) => notat.type === 'Generelt');
};

interface InfoPinProps {
    period: DatePeriod;
}

export const InfoPin = ({ period }: InfoPinProps): ReactElement | null => {
    const showInfoPin = shouldShowInfoPin(period);
    const showNotatPin = shouldShowNotatPin(period);

    if (!showInfoPin && !showNotatPin) {
        return null;
    }

    return <div className={classNames(styles.Pin, showNotatPin && styles.notat)} />;
};
