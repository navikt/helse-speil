import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { ReactElement, ReactNode, useRef } from 'react';

import { useUvurderteVarslerPåPeriode } from '@hooks/uvurderteVarsler';
import { PersonFragment } from '@io/graphql';
import { useSetActivePeriodId } from '@state/periode';
import { PeriodState } from '@typer/shared';
import { TimelinePeriod } from '@typer/timeline';
import { getPeriodState } from '@utils/mapping';
import { cn } from '@utils/tw';
import { isBeregnetPeriode, isGhostPeriode, isInfotrygdPeriod, isUberegnetPeriode } from '@utils/typeguards';

import { InfoPin } from './InfoPin';
import { PeriodPopover } from './PeriodPopover';
import { useIsWiderThan } from './hooks/useIsWiderThan';
import { usePopoverAnchor } from './hooks/usePopoverAnchor';
import { BlankIcon, CheckIcon, CrossIcon, TaskIcon, TilkommenInntektIkon, WaitingIcon } from './icons';
import { UvurderteVarslerIcon } from './icons/UvurderteVarslerIcon';

import styles from './Period.module.css';

export type PeriodCategory =
    | 'success'
    | 'error'
    | 'attention'
    | 'waiting'
    | 'neutral'
    | 'neutralError'
    | 'plus'
    | 'ghost'
    | 'historisk'
    | 'ukjent';

export const getPeriodCategory = (periodState: PeriodState): PeriodCategory => {
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
        case 'venterPåInntektsopplysninger':
        case 'venterPåKiling':
        case 'tilAnnullering':
        case 'tilUtbetalingAutomatisk':
        case 'tilUtbetaling':
        case 'avventerAnnullering': {
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
            return 'ukjent';
        }
    }
};

const getIcon = (periodCategory: PeriodCategory | null): ReactNode => {
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
        case 'plus': {
            return <TilkommenInntektIkon />;
        }
        default: {
            return <BlankIcon />;
        }
    }
};

const getClassNames = (period: TimelinePeriod, notCurrent?: boolean, isActive?: boolean, className?: string) => {
    const periodState = getPeriodState(period);
    const periodCategory = getPeriodCategory(periodState);

    return cn(
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
    person: PersonFragment;
    erSelvstendigNæringsdrivende: boolean;
}

export const Period = ({
    period,
    notCurrent,
    isActive,
    className,
    person,
    erSelvstendigNæringsdrivende,
    ...buttonProps
}: PeriodProps): ReactElement => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const setActivePeriodId = useSetActivePeriodId(person);
    const button = useRef<HTMLButtonElement>(null);
    const iconIsVisible = useIsWiderThan(button, 32);
    const harUvurderteVarsler = useUvurderteVarslerPåPeriode(period);
    const pathname = usePathname();
    const router = useRouter();

    const { onMouseOver, onMouseOut, onFocus, onBlur, ...popoverProps } = usePopoverAnchor();

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        buttonProps.onClick?.(event);
        if (isBeregnetPeriode(period) || isUberegnetPeriode(period) || isGhostPeriode(period)) {
            setActivePeriodId(period.id);
            const erPåTilkommenInntektSide = pathname.includes('/tilkommeninntekt/');
            if (erPåTilkommenInntektSide) {
                router.push(`/person/${personPseudoId}/dagoversikt`);
            }
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
                onFocus={onFocus}
                onBlur={onBlur}
                onClick={onClick}
                ref={button}
                aria-label="Gå til vedtaksperiode"
            >
                {iconIsVisible && getIcon(periodCategory)}
                {!notCurrent && <InfoPin period={period} />}
                {harUvurderteVarsler && <UvurderteVarslerIcon className={styles.uvurderteVarslerIcon} />}
            </button>
            <PeriodPopover
                period={period}
                state={periodState}
                person={person}
                erSelvstendigNæringsdrivende={erSelvstendigNæringsdrivende}
                {...popoverProps}
            />
        </>
    );
};
