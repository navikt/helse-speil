import React from 'react';
import classNames from 'classnames';

import { useSetActivePeriod } from '@state/periode';
import { getPeriodCategory, getPeriodState } from '@utils/mapping';
import { Sykdomsdagtype, Utbetalingsdagtype } from '@io/graphql';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

import { PeriodPopover } from './PeriodPopover';
import { usePopoverAnchor } from './usePopoverAnchor';

import styles from './Periods.module.css';

const shouldShowInfoPin = (period: DatePeriod): boolean => {
    if (!isBeregnetPeriode(period)) return false;

    const utbetalingsdagTypes = [Utbetalingsdagtype.Arbeidsgiverperiodedag, Utbetalingsdagtype.Feriedag];
    const sykdomsdagTypes = [Sykdomsdagtype.Permisjonsdag];

    for (const day of period.tidslinje) {
        if (utbetalingsdagTypes.includes(day.utbetalingsdagtype) || sykdomsdagTypes.includes(day.sykdomsdagtype)) {
            return true;
        }
    }
    return false;
};

interface PeriodProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    period: DatePeriod;
    notCurrent?: boolean;
    isActive?: boolean;
}

export const Period: React.VFC<PeriodProps> = ({ period, notCurrent, isActive, ...buttonProps }) => {
    const setActivePeriod = useSetActivePeriod();

    const periodState = getPeriodState(period);
    const periodCategory = getPeriodCategory(periodState);

    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor();

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        buttonProps.onClick?.(event);
        if (isBeregnetPeriode(period) || isUberegnetPeriode(period) || isGhostPeriode(period)) {
            setActivePeriod(period);
        }
    };

    return (
        <>
            <button
                className={classNames(
                    styles.Period,
                    styles[periodState],
                    isActive && styles.active,
                    periodCategory && styles[periodCategory],
                    notCurrent && styles.old,
                )}
                {...buttonProps}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClick}
            >
                {!notCurrent && shouldShowInfoPin(period) && <div className={styles.InfoPin} />}
            </button>
            <PeriodPopover period={period} state={periodState} {...popoverProps} />
        </>
    );
};
