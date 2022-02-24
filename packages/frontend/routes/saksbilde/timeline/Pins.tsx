import React from 'react';
import dayjs from 'dayjs';

import { Arbeidsgiver } from '@io/graphql';
import { BodyShort, Popover } from '@navikt/ds-react';

import { useMaksdato } from './useMaksdato';
import { getPosition } from './usePeriodStyling';
import { usePopoverAnchor } from './usePopoverAnchor';

import styles from './Pins.module.css';

interface PinProps extends React.HTMLAttributes<HTMLDivElement> {}

const Pin: React.FC<PinProps> = ({ children, ...divProps }) => {
    const { onMouseOver, onMouseOut, ...popoverProps } = usePopoverAnchor();

    return (
        <div onMouseOver={onMouseOver} onMouseOut={onMouseOut} {...divProps}>
            <Popover placement="top" {...popoverProps}>
                <Popover.Content className={styles.Content}>{children}</Popover.Content>
            </Popover>
        </div>
    );
};

interface PinsProps {
    start: Dayjs;
    end: Dayjs;
    arbeidsgivere: Array<Arbeidsgiver>;
}

export const Pins: React.VFC<PinsProps> = ({ arbeidsgivere, start, end }) => {
    const maksdato = useMaksdato(arbeidsgivere);

    return (
        <div className={styles.Pins}>
            {maksdato && (
                <Pin className={styles.Pin} style={{ right: `${getPosition(dayjs(maksdato), start, end)}%` }}>
                    <BodyShort size="small">Maksdato:</BodyShort>
                    <BodyShort size="small">{maksdato}</BodyShort>
                </Pin>
            )}
        </div>
    );
};
