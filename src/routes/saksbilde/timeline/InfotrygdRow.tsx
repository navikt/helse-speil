import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { InfotrygdPeriod } from '@/types/shared';
import { Infotrygdikon } from '@components/ikoner/Infotrygdikon';

import { Periods } from './Periods';

import styles from './TimelineRow.module.css';

interface InfotrygdRowProps {
    start: Dayjs;
    end: Dayjs;
    periods: Array<InfotrygdPeriod>;
    alignWithExpandable?: boolean;
}

export const InfotrygdRow: React.FC<InfotrygdRowProps> = ({ start, end, periods, alignWithExpandable = false }) => {
    return (
        <div className={styles.TimelineRow}>
            <div className={classNames(styles.Name, alignWithExpandable && styles.AlignWithExpandable)}>
                <Infotrygdikon />
                <BodyShort size="small">Infotrygd</BodyShort>
            </div>
            <div className={styles.Periods}>
                <Periods periods={[]} start={start} end={end} infotrygdPeriods={periods} />
            </div>
        </div>
    );
};
