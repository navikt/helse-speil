import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Infotrygdikon } from '@components/ikoner/Infotrygdikon';

import { Periods } from './Periods';

import styles from './TimelineRow.module.css';

interface InfotrygdRowProps {
    start: Dayjs;
    end: Dayjs;
    periods: Array<InfotrygdPeriod>;
}

export const InfotrygdRow: React.VFC<InfotrygdRowProps> = ({ start, end, periods }) => {
    return (
        <div className={styles.TimelineRow}>
            <div className={styles.Name}>
                <Infotrygdikon />
                <BodyShort size="small">Infotrygd</BodyShort>
            </div>
            <div className={styles.Periods}>
                <Periods periods={[]} start={start} end={end} infotrygdPeriods={periods} />
            </div>
        </div>
    );
};
