import React, { ReactNode, RefObject, useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Period } from '@navikt/helse-frontend-timeline/lib';
import { PeriodProps } from '@navikt/helse-frontend-timeline/lib/components/Period';
import { Infotrygdperiodetilstand, Revurderingtilstand, Vedtaksperiodetilstand } from 'internal-types';
import { TidslinjeperiodeIkon } from '../ikoner/Tidslinjeperiodeikoner';
import classNames from 'classnames';

interface StyledPeriodProps {
    erAktiv?: boolean;
    ref?: RefObject<HTMLButtonElement>;
}

export const StyledPeriod = styled(Period)<StyledPeriodProps>`
    display: flex;
    align-items: center;
    ${({ erAktiv }) =>
        erAktiv &&
        `
        box-shadow: 0 0 0 2px var(--navds-text-focus);
        border-color: var(--navds-text-focus);
        z-index: 20;
    `}
    &.foreldet {
        &.tilUtbetaling,
        &.tilUtbetalingAutomatisk,
        &.utbetalt,
        &.revurdert,
        &.utbetaltAutomatisk {
            --period-background-color: var(--nav-lime-gronn-lighten-80);
            --period-hover-color: #dade99;
            --period-border-color: var(--nav-lime-gronn-darken-40);
        }

        &.avslag,
        &.feilet,
        &.annullert,
        &.tilAnnullering,
        &.annulleringFeilet {
            --period-background-color: var(--navds-color-red-10);
            --period-hover-color: var(--navds-color-tag-error-background);
            --period-border-color: var(--navds-color-tag-error-border);
        }
    }

    &.gjeldende {
        &.revurderes,
        &.oppgaver {
            --period-background-color: var(--navds-color-orange-10);
            --period-hover-color: var(--navds-color-tag-warning-background);
            --period-border-color: var(--navds-color-tag-warning-border);
        }

        &.tilUtbetaling,
        &.tilUtbetalingAutomatisk,
        &.utbetalt,
        &.revurdert,
        &.utbetaltAutomatisk {
            --period-background-color: var(--navds-color-green-10);
            --period-hover-color: var(--navds-color-tag-success-background);
            --period-border-color: var(--navds-color-tag-success-border);
        }

        &.avslag,
        &.feilet,
        &.annullert,
        &.tilAnnullering,
        &.annulleringFeilet {
            --period-background-color: var(--navds-color-red-10);
            --period-hover-color: var(--navds-color-tag-error-background);
            --period-border-color: var(--navds-color-tag-error-border);
        }
    }
`;

interface TidslinjeperiodeProps extends PeriodProps {
    id: string;
    style: React.CSSProperties;
    tilstand: Vedtaksperiodetilstand | Revurderingtilstand | Infotrygdperiodetilstand;
    erAktiv?: boolean;
    erForeldet?: boolean;
    hoverLabel?: ReactNode;
    skalVisePin: boolean;
}

const PeriodePin = styled.div`
    position: absolute;
    background: #0067c5;
    height: 6px;
    width: 2px;
    top: 0;
    left: 50%;
    transform: translate(-1px, -7px);

    &:before {
        content: '';
        position: absolute;
        top: 0;
        width: 10px;
        height: 10px;
        background: #0067c5;
        transform: translate(-5px, -100%);
        border-radius: 50%;
    }
`;

export const Tidslinjeperiode = (props: TidslinjeperiodeProps) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [erMini, setErMini] = useState(false);

    const [showHoverLabel, setShowHoverLabel] = useState(false);

    const enableHoverLabel = () => {
        props.hoverLabel && setShowHoverLabel(true);
    };

    const disableHoverLabel = () => {
        props.hoverLabel && setShowHoverLabel(false);
    };

    useLayoutEffect(() => {
        if (ref.current && ref.current.offsetWidth <= 30.0) {
            setErMini(true);
        }
    }, [ref.current]);

    const preventHoverRender = (e: React.MouseEvent) => {
        setShowHoverLabel(false);
        e.stopPropagation();
    };

    return (
        <div onMouseOver={enableHoverLabel} onMouseOut={disableHoverLabel} data-testid="tidslinjeperiode">
            <StyledPeriod
                erAktiv={props.erAktiv}
                ref={ref}
                className={classNames(props.tilstand, props.erForeldet ? 'foreldet' : 'gjeldende')}
                {...props}
            >
                {!erMini && (
                    <TidslinjeperiodeIkon
                        tilstand={props.tilstand}
                        styles={{ marginLeft: '0.5rem', pointerEvents: 'none' }}
                    />
                )}
                {props.skalVisePin && (
                    <div onMouseOver={preventHoverRender}>
                        <PeriodePin />
                    </div>
                )}
                {showHoverLabel && <div onMouseOver={preventHoverRender}>{props.hoverLabel}</div>}
            </StyledPeriod>
        </div>
    );
};
