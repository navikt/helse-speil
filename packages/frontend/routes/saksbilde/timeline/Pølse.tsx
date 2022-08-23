import React, { ReactNode, useRef } from 'react';
import classNames from 'classnames';

import { useSetActivePeriod } from '@state/periode';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode, isGhostPeriode, isInfotrygdPeriod, isUberegnetPeriode } from '@utils/typeguards';

import { InfoPin } from './InfoPin';
import { PeriodPopover } from './PeriodPopover';
import { BlankIcon, CheckIcon, CrossIcon, TaskIcon, WaitingIcon } from './icons';
import { usePopoverAnchor } from './hooks/usePopoverAnchor';
import { useIsWiderThan } from './hooks/useIsWiderThan';

import styles from './Pølse.module.css';

type PølseState = 'success' | 'error' | 'attention' | 'waiting';

const getPølseState = (periodState: PeriodState): Maybe<PølseState> => {
    switch (periodState) {
        case 'ingenUtbetaling':
        case 'kunPermisjon':
        case 'kunFerie':
        case 'utbetaltAutomatisk':
        case 'revurdert':
        case 'revurdertIngenUtbetaling':
        case 'utenSykefravær':
        case 'utenSykefraværDeaktivert':
        case 'infotrygdUtbetalt':
        case 'infotrygdFerie':
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
        case 'infotrygdUkjent':
        case 'ukjent':
        default: {
            return null;
        }
    }
};

const getIcon = (pølseState: Maybe<PølseState>): ReactNode => {
    switch (pølseState) {
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

const getClassNames = (period: DatePeriod, notCurrent?: boolean, isActive?: boolean, className?: string) => {
    const periodState = getPeriodState(period);
    const pølseState = getPølseState(periodState);

    return classNames(
        styles.Polse,
        className,
        pølseState && styles[pølseState],
        isActive && styles.active,
        notCurrent && styles.old,
        isInfotrygdPeriod(period) && styles.legacy,
        isGhostPeriode(period) && styles.blank,
    );
};

interface PølseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    period: DatePeriod;
    notCurrent?: boolean;
    isActive?: boolean;
}

export const Pølse: React.FC<PølseProps> = ({ period, notCurrent, isActive, className, ...buttonProps }) => {
    const setActivePeriod = useSetActivePeriod();
    const button = useRef<HTMLButtonElement>(null);
    const iconIsVisible = useIsWiderThan(button, 16);

    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor();

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        buttonProps.onClick?.(event);
        if (isBeregnetPeriode(period) || isUberegnetPeriode(period) || isGhostPeriode(period)) {
            setActivePeriod(period);
        }
    };

    const periodState = getPeriodState(period);
    const pølseState = getPølseState(periodState);

    return (
        <>
            <button
                className={getClassNames(period, notCurrent, isActive, className)}
                {...buttonProps}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClick}
                ref={button}
            >
                {iconIsVisible && getIcon(pølseState)}
                {!notCurrent && <InfoPin period={period} />}
            </button>
            <PeriodPopover period={period} state={getPeriodState(period)} {...popoverProps} />
        </>
    );
};
