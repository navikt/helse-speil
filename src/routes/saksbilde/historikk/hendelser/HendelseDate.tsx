import styles from './Hendelse.module.scss';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { DateString } from '@/types/shared';
import { getFormattedDatetimeString } from '@utils/date';

type HendelseDateProps = {
    timestamp?: DateString;
    ident?: Maybe<string>;
};

export const HendelseDate = ({ timestamp, ident }: HendelseDateProps) => {
    return (
        <BodyShort className={styles.date} as="p" size="small">
            {timestamp && getFormattedDatetimeString(timestamp)}
            {timestamp && ident && <span>·</span>}
            {ident}
        </BodyShort>
    );
};
