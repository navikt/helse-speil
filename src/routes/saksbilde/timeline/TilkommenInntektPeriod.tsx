import classNames from 'classnames';
import React, { ReactElement, useRef } from 'react';

import { BodyShort, Popover } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { TilkommenInntekt } from '@io/graphql';
import { useActiveTilkommenInntektId, useSetActiveTilkommenInntektId } from '@state/periode';
import { DatePeriod } from '@typer/shared';
import { somNorskDato } from '@utils/date';

import { useIsWiderThan } from './hooks/useIsWiderThan';
import { usePopoverAnchor } from './hooks/usePopoverAnchor';
import { PlusIcon } from './icons';

import styles from './Period.module.css';

const getClassNames = (isActive?: boolean) => {
    return classNames(styles.Period, styles['plus'], isActive && styles.active, styles.tilkommen);
};

interface PeriodProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    tilkommenInntekt: TilkommenInntekt;
}

const TilkommenPopover = ({ fom, tom }: DatePeriod): ReactElement => {
    return (
        <>
            <BodyShort size="small">Tilkommen inntekt</BodyShort>
            <BodyShort size="small">Periode:</BodyShort>
            <BodyShort size="small">
                {fom} - {tom}
            </BodyShort>
        </>
    );
};

export const TilkommenInntektPeriod = ({ tilkommenInntekt, ...buttonProps }: PeriodProps): ReactElement => {
    const activeTilkommenInntektId = useActiveTilkommenInntektId();
    const setActiveTilkommenInntektId = useSetActiveTilkommenInntektId();
    const button = useRef<HTMLButtonElement>(null);
    const iconIsVisible = useIsWiderThan(button, 32);
    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor();
    const isActive = activeTilkommenInntektId == tilkommenInntekt.tilkommenInntektId;
    const fom = somNorskDato(tilkommenInntekt.periode.fom) ?? '-';
    const tom = somNorskDato(tilkommenInntekt.periode.tom) ?? '-';

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        buttonProps.onClick?.(event);
        setActiveTilkommenInntektId(tilkommenInntekt.tilkommenInntektId);
    };

    return (
        <>
            <button
                className={getClassNames(isActive)}
                {...buttonProps}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClick}
                ref={button}
                aria-label="Gå til tilkommen inntekt"
            >
                {iconIsVisible && <PlusIcon />}
            </button>
            <Popover {...popoverProps}>
                <Popover.Content className={styles.RouteContainer}>
                    <ErrorBoundary fallback={<div />}>
                        <TilkommenPopover fom={fom} tom={tom} />
                    </ErrorBoundary>
                </Popover.Content>
            </Popover>
        </>
    );
};
