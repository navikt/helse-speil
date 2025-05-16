import classNames from 'classnames';
import React, { ReactElement, useRef } from 'react';

import { BodyShort, Popover } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { TilkommenInntekt } from '@io/graphql';
import { TilkommenInntektIkon } from '@saksbilde/timeline/icons';
import { useNavigerTilTilkommenInntekt, useTilkommenInntektIdFraUrl } from '@state/routing';
import { somNorskDato } from '@utils/date';

import { useIsWiderThan } from './hooks/useIsWiderThan';
import { usePopoverAnchor } from './hooks/usePopoverAnchor';
import { FjernetTilkommenInntektIkon } from './icons/FjernetTilkommenInntektIkon';

import styles from './TilkommenInntektPeriod.module.css';

interface PeriodProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    tilkommenInntekt: TilkommenInntekt;
}

export const TilkommenInntektPeriod = ({ tilkommenInntekt, ...buttonProps }: PeriodProps): ReactElement => {
    const activeTilkommenInntektId = useTilkommenInntektIdFraUrl();
    const navigerTilTilkommenInntekt = useNavigerTilTilkommenInntekt();
    const button = useRef<HTMLButtonElement>(null);
    const iconIsVisible = useIsWiderThan(button, 32);
    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor();
    const isActive = activeTilkommenInntektId == tilkommenInntekt.tilkommenInntektId;
    const fom = somNorskDato(tilkommenInntekt.periode.fom) ?? '-';
    const tom = somNorskDato(tilkommenInntekt.periode.tom) ?? '-';

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        buttonProps.onClick?.(event);
        navigerTilTilkommenInntekt(tilkommenInntekt.tilkommenInntektId);
    };

    return (
        <>
            <button
                className={classNames(styles.tilkommenInntekt, isActive && styles.active)}
                {...buttonProps}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClick}
                ref={button}
                aria-label="Gå til tilkommen inntekt"
            >
                {iconIsVisible &&
                    (tilkommenInntekt.fjernet ? (
                        <FjernetTilkommenInntektIkon className={styles.fjernetIkon} />
                    ) : (
                        <TilkommenInntektIkon className={styles.vanligIkon} />
                    ))}
            </button>
            <Popover {...popoverProps}>
                <Popover.Content className={styles.RouteContainer}>
                    <ErrorBoundary fallback={<div />}>
                        <BodyShort size="small">
                            Tilkommen inntekt
                            {tilkommenInntekt.fjernet ? ' (fjernet)' : ''}
                        </BodyShort>
                        <BodyShort size="small">Periode:</BodyShort>
                        <BodyShort size="small">
                            {fom} - {tom}
                        </BodyShort>
                    </ErrorBoundary>
                </Popover.Content>
            </Popover>
        </>
    );
};
