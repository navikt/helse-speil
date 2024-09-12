import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Infotrygdikon } from '@components/ikoner/Infotrygdikon';
import { PersonFragment } from '@io/graphql';
import { InfotrygdPeriod } from '@typer/shared';

import { Periods } from './Periods';

import styles from './TimelineRow.module.css';

interface InfotrygdRowProps {
    start: Dayjs;
    end: Dayjs;
    periods: Array<InfotrygdPeriod>;
    alignWithExpandable?: boolean;
    person: PersonFragment;
}

export const InfotrygdRow = ({
    start,
    end,
    periods,
    alignWithExpandable = false,
    person,
}: InfotrygdRowProps): ReactElement => {
    return (
        <div className={styles.TimelineRow}>
            <div className={classNames(styles.Name, alignWithExpandable && styles.AlignWithExpandable)}>
                <Infotrygdikon />
                <BodyShort size="small">Infotrygd</BodyShort>
            </div>
            <div className={styles.Periods}>
                <Periods
                    periods={[]}
                    start={start}
                    end={end}
                    infotrygdPeriods={periods}
                    activePeriod={null}
                    person={person}
                />
            </div>
        </div>
    );
};
