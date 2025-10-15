import dayjs, { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort, Popover } from '@navikt/ds-react';

import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { getFormattedDateString } from '@utils/date';

import { useMaksdato } from './hooks/useMaksdato';
import { getPosition } from './hooks/usePeriodStyling';
import { usePopoverAnchor } from './hooks/usePopoverAnchor';

import styles from './Pins.module.css';

type PinProps = React.HTMLAttributes<HTMLDivElement>;

const Pin = ({ children, ...divProps }: PinProps): ReactElement => {
    const { onMouseOver, onMouseOut, onFocus, onBlur, ...popoverProps } = usePopoverAnchor();

    return (
        <div onMouseOver={onMouseOver} onMouseOut={onMouseOut} onFocus={onFocus} onBlur={onBlur} {...divProps}>
            <Popover placement="top" {...popoverProps}>
                <Popover.Content className={styles.Content}>{children}</Popover.Content>
            </Popover>
        </div>
    );
};

const shouldShowPin = (position?: number | null): boolean =>
    typeof position === 'number' && position > 0 && position < 100;

interface PinsProps {
    start: Dayjs;
    end: Dayjs;
    inntektsforhold: Inntektsforhold[];
}

export const Pins = ({ inntektsforhold, start, end }: PinsProps): ReactElement => {
    const maksdato = useMaksdato(inntektsforhold);
    const maksdatoPosition = maksdato ? getPosition(dayjs(maksdato), start, end) : -1;

    return (
        <div className={styles.Pins}>
            {shouldShowPin(maksdatoPosition) && (
                <Pin className={styles.Pin} style={{ right: `${getPosition(dayjs(maksdato), start, end)}%` }}>
                    <BodyShort size="small">Maksdato:</BodyShort>
                    <BodyShort size="small">{getFormattedDateString(maksdato)}</BodyShort>
                </Pin>
            )}
        </div>
    );
};
