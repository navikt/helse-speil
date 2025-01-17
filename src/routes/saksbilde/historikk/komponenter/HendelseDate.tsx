import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';
import { DateString } from '@typer/shared';
import { getFormattedDatetimeString } from '@utils/date';

import styles from './HendelseDate.module.scss';

type HendelseDateProps = {
    timestamp?: DateString;
    ident?: Maybe<string>;
};

export const HendelseDate = ({ timestamp, ident }: HendelseDateProps): ReactElement => {
    return (
        <BodyShort className={styles.date} size="small">
            {timestamp && getFormattedDatetimeString(timestamp)}
            {timestamp && ident && <span>·</span>}
            {ident}
        </BodyShort>
    );
};
