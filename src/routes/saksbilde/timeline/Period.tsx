import classNames from 'classnames';
import React, { ReactElement, ReactNode, useRef } from 'react';

import { useUvurderteVarslerPåPeriode } from '@hooks/uvurderteVarsler';
import { useSetActivePeriodId } from '@state/periode';
import { PeriodState } from '@typer/shared';
import { TimelinePeriod } from '@typer/timeline';
import { getPeriodState } from '@utils/mapping';
import { Maybe } from '@utils/ts';
import { isBeregnetPeriode, isGhostPeriode, isInfotrygdPeriod, isUberegnetPeriode } from '@utils/typeguards';

import { InfoPin } from './InfoPin';
import { PeriodPopover } from './PeriodPopover';
import { useIsWiderThan } from './hooks/useIsWiderThan';
import { usePopoverAnchor } from './hooks/usePopoverAnchor';
import { BlankIcon, CheckIcon, CrossIcon, TaskIcon, WaitingIcon } from './icons';
import { UvurderteVarslerIcon } from './icons/UvurderteVarslerIcon';

import styles from './Period.module.css';

type PeriodCategory = 'success' | 'error' | 'attention' | 'waiting' | 'neutral' | 'neutralError';

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
        case 'tilGodkjenning':
        case 'tilSkjønnsfastsettelse': {
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
        case 'forkastetIngenUtbetaling':
            return 'neutralError';
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
        case 'neutralError':
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

const getClassNames = (period: TimelinePeriod, notCurrent?: boolean, isActive?: boolean, className?: string) => {
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
    );
};

interface PeriodProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    period: TimelinePeriod;
    notCurrent?: boolean;
    isActive?: boolean;
}

export const Period = ({ period, notCurrent, isActive, className, ...buttonProps }: PeriodProps): ReactElement => {
    const setActivePeriodId = useSetActivePeriodId();
    const button = useRef<HTMLButtonElement>(null);
    const iconIsVisible = useIsWiderThan(button, 32);
    const harUvurderteVarsler = useUvurderteVarslerPåPeriode(period);

    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor();

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        buttonProps.onClick?.(event);
        if (isBeregnetPeriode(period) || isUberegnetPeriode(period) || isGhostPeriode(period)) {
            setActivePeriodId(period.id);
        }
    };

    const periodState = getPeriodState(period);
    const periodCategory = getPeriodCategory(periodState);

    return (
        <>
            <button
                className={getClassNames(period, notCurrent, isActive, className)}
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
            <PeriodPopover period={period} state={periodState} {...popoverProps} />
        </>
    );
};
