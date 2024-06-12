import dayjs, { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort, Popover } from '@navikt/ds-react';

import { ArbeidsgiverFragment } from '@io/graphql';
import { getFormattedDateString } from '@utils/date';
import { Maybe } from '@utils/ts';

import { useMaksdato } from './hooks/useMaksdato';
import { getPosition } from './hooks/usePeriodStyling';
import { usePopoverAnchor } from './hooks/usePopoverAnchor';

import styles from './Pins.module.css';

type PinProps = React.HTMLAttributes<HTMLDivElement>;

const Pin = ({ children, ...divProps }: PinProps): ReactElement => {
    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor();

    return (
        <div onMouseOver={onMouseOver} onMouseOut={onMouseOut} {...divProps}>
            <Popover placement="top" {...popoverProps}>
                <Popover.Content className={styles.Content}>{children}</Popover.Content>
            </Popover>
        </div>
    );
};

const shouldShowPin = (position?: Maybe<number>): boolean =>
    typeof position === 'number' && position > 0 && position < 100;

interface PinsProps {
    start: Dayjs;
    end: Dayjs;
    arbeidsgivere: Array<ArbeidsgiverFragment>;
}

export const Pins = ({ arbeidsgivere, start, end }: PinsProps): ReactElement => {
    const maksdato = useMaksdato(arbeidsgivere);
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
