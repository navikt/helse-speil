import React from 'react';
import classNames from 'classnames';

import { isBeregnetPeriode } from '@utils/typeguards';
import { Sykdomsdagtype, Utbetalingsdagtype } from '@io/graphql';

import styles from './InfoPin.module.css';

const shouldShowInfoPin = (period: DatePeriod): boolean => {
    if (!isBeregnetPeriode(period)) return false;

    return period.tidslinje.some(
        (dag) =>
            [Utbetalingsdagtype.Arbeidsgiverperiodedag, Utbetalingsdagtype.Feriedag].includes(dag.utbetalingsdagtype) ||
            [Sykdomsdagtype.Permisjonsdag].includes(dag.sykdomsdagtype),
    );
};

const shouldShowNotatPin = (period: DatePeriod): boolean => {
    if (!isBeregnetPeriode(period)) return false;

    return period.notater.some((notat) => notat.type === 'Generelt');
};

interface InfoPinProps {
    period: DatePeriod;
}

export const InfoPin: React.FC<InfoPinProps> = ({ period }) => {
    const showInfoPin = shouldShowInfoPin(period);
    const showNotatPin = shouldShowNotatPin(period);

    if (!showInfoPin && !showNotatPin) {
        return null;
    }

    return <div className={classNames(styles.Pin, showNotatPin && styles.notat)} />;
};
