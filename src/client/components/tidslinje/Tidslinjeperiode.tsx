import React, { ReactNode, RefObject, useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Period } from '@navikt/helse-frontend-timeline/lib';
import { PeriodProps } from '@navikt/helse-frontend-timeline/lib/components/Period';
import { Revurderingtilstand, Vedtaksperiodetilstand } from 'internal-types';
import {
    annullert,
    avslag,
    infotrygdferie,
    infotrygdukjent,
    ingenUtbetaling,
    kunFerie,
    kunPermisjon,
    oppgaver,
    revurdert,
    tilAnnullering,
    tilUtbetaling,
    tilUtbetalingAutomatisk,
    ukjent,
    utbetalt,
    utbetaltAutomatisk,
    utbetaltIInfotrygd,
    venter,
} from '../ikoner/Tidslinjeperiodeikoner';

interface StyledPeriodProps {
    erAktiv?: boolean;
    erMini?: boolean;
    ref?: RefObject<HTMLButtonElement>;
}

export const StyledPeriod = styled(Period)<StyledPeriodProps>`
    ${({ erAktiv }) =>
        erAktiv &&
        `
        box-shadow: 0 0 0 2px var(--navds-text-focus);
        border-color: var(--navds-text-focus);
        z-index: 20;
    `}
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

    &:before {
        content: '';
        position: absolute;
        height: 15px;
        width: 16px;
        top: 50%;
        left: 6px;
        transform: translateY(-50%);
        background-image: url(\"${ukjent}\");
        background-repeat: no-repeat;
    }

    &.kunPermisjon:before {
        background-image: url(\"${kunPermisjon}\");
    }

    &.kunFerie:before {
        background-image: url(\"${kunFerie}\");
    }

    &.infotrygdferie:before {
        background-image: url(\"${infotrygdferie}\");
    }

    &.infotrygdukjent:before {
        background-image: url(\"${infotrygdukjent}\");
    }

    &.utbetalt:before {
        background-image: url(\"${utbetalt}\");
    }

    &.utbetaltIInfotrygd:before {
        background-image: url(\"${utbetaltIInfotrygd}\");
    }

    &.revurdert:before,
    &.revurderes:before {
        background-image: url(\"${revurdert}\");
    }

    &.oppgaver:before {
        background-image: url(\"${oppgaver}\");
    }

    &.avslag:before {
        background-image: url(\"${avslag}\");
    }

    &.tilUtbetaling:before {
        background-image: url(\"${tilUtbetaling}\");
    }

    &.venter:before,
    &.venterPåKiling:before {
        background-image: url(\"${venter}\");
    }

    &.ingenUtbetaling:before {
        background-image: url(\"${ingenUtbetaling}\");
    }

    &.annullert:before {
        background-image: url(\"${annullert}\");
    }

    &.tilAnnullering:before {
        background-image: url(\"${tilAnnullering}\");
    }

    &.utbetaltAutomatisk:before {
        background-image: url(\"${utbetaltAutomatisk}\");
    }

    &.tilUtbetalingAutomatisk:before {
        background-image: url(\"${tilUtbetalingAutomatisk}\");
    }

    ${({ erMini }) => erMini && `&:before { display: none; }`}
`;

interface TidslinjeperiodeProps extends PeriodProps {
    id: string;
    style: React.CSSProperties;
    className: Vedtaksperiodetilstand | Revurderingtilstand;
    erAktiv?: boolean;
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
        <div onMouseOver={enableHoverLabel} onMouseOut={disableHoverLabel}>
            <StyledPeriod erMini={erMini} erAktiv={props.erAktiv} ref={ref} {...props}>
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
