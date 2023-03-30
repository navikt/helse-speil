import classNames from 'classnames';
import React, { ReactNode, useRef } from 'react';

import { useUvurderteVarslerPåPeriode } from '@hooks/uvurderteVarsler';
import { useSetActivePeriod } from '@state/periode';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode, isGhostPeriode, isInfotrygdPeriod, isUberegnetPeriode } from '@utils/typeguards';

import { InfoPin } from './InfoPin';
import { PeriodPopover } from './PeriodPopover';
import { useIsWiderThan } from './hooks/useIsWiderThan';
import { usePopoverAnchor } from './hooks/usePopoverAnchor';
import { BlankIcon, CheckIcon, CrossIcon, TaskIcon, WaitingIcon } from './icons';
import { UvurderteVarslerIcon } from './icons/UvurderteVarslerIcon';

import styles from './Period.module.css';

type PeriodCategory = 'success' | 'error' | 'attention' | 'waiting' | 'neutral';

const getPeriodCategory = (periodState: PeriodState): Maybe<PeriodCategory> => {
    switch (periodState) {
        case 'utbetaltAutomatisk':
        case 'revurdert':
        case 'infotrygdUtbetalt':
        case 'utbetalt': {
            return 'success';
        }
        case 'revurderingFeilet':
        case 'utbetalingFeilet':
        case 'tilInfotrygd':
        case 'annullert':
        case 'annulleringFeilet':
        case 'avslag': {
            return 'error';
        }
        case 'revurderes':
        case 'tilGodkjenning': {
            return 'attention';
        }
        case 'venter':
        case 'venterPåKiling':
        case 'tilAnnullering':
        case 'tilUtbetalingAutomatisk':
        case 'tilUtbetaling': {
            return 'waiting';
        }
        case 'infotrygdFerie':
        case 'utenSykefravær':
        case 'utenSykefraværDeaktivert':
        case 'revurdertIngenUtbetaling':
        case 'ingenUtbetaling':
        case 'kunPermisjon':
        case 'kunFerie':
            return 'neutral';
        case 'infotrygdUkjent':
        case 'ukjent':
        default: {
            return null;
        }
    }
};

const getIcon = (periodCategory: Maybe<PeriodCategory>): ReactNode => {
    switch (periodCategory) {
        case 'neutral':
        case 'success': {
            return <CheckIcon />;
        }
        case 'error': {
            return <CrossIcon />;
        }
        case 'attention': {
            return <TaskIcon />;
        }
        case 'waiting': {
            return <WaitingIcon />;
        }
        default: {
            return <BlankIcon />;
        }
    }
};

const getClassNames = (
    period: DatePeriod,
    notCurrent?: boolean,
    isActive?: boolean,
    className?: string,
    generation?: number
) => {
    const periodState = getPeriodState(period);
    const periodCategory = getPeriodCategory(periodState);

    return classNames(
        styles.Period,
        className,
        periodCategory && styles[periodCategory],
        isActive && styles.active,
        notCurrent && styles.old,
        isInfotrygdPeriod(period) && styles.legacy,
        isGhostPeriode(period) && styles.blank,
        isUberegnetPeriode(period) && generation !== 0 && styles.inactiveAUU
    );
};

interface PeriodProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    period: DatePeriod;
    notCurrent?: boolean;
    isActive?: boolean;
    generation?: number;
}

export const Period: React.FC<PeriodProps> = ({
    period,
    notCurrent,
    isActive,
    className,
    generation,
    ...buttonProps
}) => {
    const setActivePeriod = useSetActivePeriod();
    const button = useRef<HTMLButtonElement>(null);
    const iconIsVisible = useIsWiderThan(button, 32);
    const harUvurderteVarsler = useUvurderteVarslerPåPeriode(period);

    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor();

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        buttonProps.onClick?.(event);
        if (
            isBeregnetPeriode(period) ||
            (isUberegnetPeriode(period) && (generation === 0 || generation == undefined)) ||
            isGhostPeriode(period)
        ) {
            setActivePeriod(period);
        }
    };

    const periodState = getPeriodState(period);
    const periodCategory = getPeriodCategory(periodState);

    return (
        <>
            <button
                className={getClassNames(period, notCurrent, isActive, className, generation)}
                {...buttonProps}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClick}
                ref={button}
                aria-label="Gå til vedtaksperiode"
            >
                {iconIsVisible && getIcon(periodCategory)}
                {!notCurrent && <InfoPin period={period} />}
                {harUvurderteVarsler && <UvurderteVarslerIcon className={styles.uvurderteVarslerIcon} />}
            </button>
            <PeriodPopover period={period} state={getPeriodState(period)} {...popoverProps} />
        </>
    );
};
