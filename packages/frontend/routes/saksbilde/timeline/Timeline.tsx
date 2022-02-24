import React from 'react';

import { Pins } from './Pins';
import { Labels } from './Labels';
import { TimelineRow } from './TimelineRow';
import { WindowPicker } from './WindowPicker';
import { useTimelineWindow } from './useTimelineWindow';
import { useInfotrygdPeriods } from './useInfotrygdPeriods';
import { ExpandableTimelineRow } from './ExpandableTimelineRow';

import type { Arbeidsgiver, Infotrygdutbetaling } from '@io/graphql';

import styles from './Timeline.module.css';

interface TimelineProps {
    arbeidsgivere: Array<Arbeidsgiver>;
    infotrygdutbetalinger: Array<Infotrygdutbetaling>;
}

export const Timeline: React.VFC<TimelineProps> = ({ arbeidsgivere, infotrygdutbetalinger }) => {
    const { availableWindows, activeWindow, setActiveWindow } = useTimelineWindow(arbeidsgivere, infotrygdutbetalinger);

    const start = activeWindow.fom.startOf('day');
    const end = activeWindow.tom.endOf('day');

    const infotrygdperioder = useInfotrygdPeriods(infotrygdutbetalinger);

    return (
        <div className={styles.Timeline}>
            <Pins start={start} end={end} arbeidsgivere={arbeidsgivere} />
            <Labels start={start} end={end} />
            <div className={styles.Rows}>
                {arbeidsgivere.map((arbeidsgiver, i) => {
                    if (arbeidsgiver.generasjoner.length > 1) {
                        return (
                            <ExpandableTimelineRow
                                key={i}
                                start={start}
                                end={end}
                                name={arbeidsgiver.navn ?? arbeidsgiver.organisasjonsnummer}
                                generations={arbeidsgiver.generasjoner}
                                infotrygdPeriods={infotrygdperioder.get(arbeidsgiver.organisasjonsnummer) ?? []}
                            />
                        );
                    } else {
                        return (
                            <TimelineRow
                                key={i}
                                start={start}
                                end={end}
                                name={arbeidsgiver.navn ?? arbeidsgiver.organisasjonsnummer}
                                periods={arbeidsgiver.generasjoner[0]?.perioder ?? []}
                                infotrygdPeriods={infotrygdperioder.get(arbeidsgiver.organisasjonsnummer) ?? []}
                            />
                        );
                    }
                })}
            </div>
            <WindowPicker
                activeWindow={activeWindow}
                availableWindows={availableWindows}
                setActiveWindow={setActiveWindow}
                className={styles.WindowPicker}
            />
        </div>
    );
};
