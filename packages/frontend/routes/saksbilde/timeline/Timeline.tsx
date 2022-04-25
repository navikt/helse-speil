import React from 'react';
import classNames from 'classnames';
import { BodyShort } from '@navikt/ds-react';

import { Pins } from './Pins';
import { Labels } from './Labels';
import { TimelineRow } from './TimelineRow';
import { InfotrygdRow } from './InfotrygdRow';
import { WindowPicker } from './WindowPicker';
import { useTimelineWindow } from './useTimelineWindow';
import { useInfotrygdPeriods } from './useInfotrygdPeriods';
import { ExpandableTimelineRow } from './ExpandableTimelineRow';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { Arbeidsgiver, Infotrygdutbetaling } from '@io/graphql';

import styles from './Timeline.module.css';

interface TimelineWithContentProps {
    arbeidsgivere: Array<Arbeidsgiver>;
    infotrygdutbetalinger: Array<Infotrygdutbetaling>;
    activePeriod: TimelinePeriod | null;
}

const TimelineWithContent: React.VFC<TimelineWithContentProps> = ({
    arbeidsgivere,
    infotrygdutbetalinger,
    activePeriod,
}) => {
    const { availableWindows, activeWindow, setActiveWindow } = useTimelineWindow(arbeidsgivere, infotrygdutbetalinger);

    const start = activeWindow.fom.startOf('day');
    const end = activeWindow.tom.endOf('day');

    const infotrygdPeriods = useInfotrygdPeriods(infotrygdutbetalinger);

    return (
        <div className={styles.Timeline}>
            <Pins start={start} end={end} arbeidsgivere={arbeidsgivere} />
            <Labels start={start} end={end} />
            <div className={styles.Rows}>
                {arbeidsgivere
                    .filter((it) => it.generasjoner.length > 0 || it.ghostPerioder.length > 0)
                    .map((arbeidsgiver, i) =>
                        arbeidsgiver.generasjoner.length > 1 ? (
                            <ExpandableTimelineRow
                                key={i}
                                start={start}
                                end={end}
                                name={arbeidsgiver.navn ?? arbeidsgiver.organisasjonsnummer}
                                generations={arbeidsgiver.generasjoner}
                                infotrygdPeriods={infotrygdPeriods.get(arbeidsgiver.organisasjonsnummer) ?? []}
                                activePeriod={activePeriod}
                            />
                        ) : (
                            <TimelineRow
                                key={i}
                                start={start}
                                end={end}
                                name={arbeidsgiver.navn ?? arbeidsgiver.organisasjonsnummer}
                                periods={arbeidsgiver.generasjoner[0]?.perioder ?? []}
                                infotrygdPeriods={infotrygdPeriods.get(arbeidsgiver.organisasjonsnummer) ?? []}
                                ghostPeriods={arbeidsgiver.ghostPerioder}
                                activePeriod={activePeriod}
                            />
                        ),
                    )}
                {infotrygdPeriods.has('0') && (
                    <InfotrygdRow start={start} end={end} periods={infotrygdPeriods.get('0') ?? []} />
                )}
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

const TimelineContainer: React.VFC = () => {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();
    const arbeidsgivere = currentPerson?.arbeidsgivere;
    const infotrygdutbetalinger = currentPerson?.infotrygdutbetalinger;

    return arbeidsgivere ? (
        <TimelineWithContent
            arbeidsgivere={arbeidsgivere}
            infotrygdutbetalinger={infotrygdutbetalinger ?? []}
            activePeriod={activePeriod}
        />
    ) : (
        <div className={styles.Timeline} />
    );
};

const TimelineSkeleton: React.VFC = () => {
    return <div className={styles.Timeline} />;
};

const TimelineError: React.VFC = () => {
    return (
        <div className={classNames(styles.Timeline, styles.Error)}>
            <BodyShort>Det har skjedd en feil. Kan ikke vise tidslinjen for denne saken.</BodyShort>
        </div>
    );
};

export const Timeline: React.VFC = () => (
    <React.Suspense fallback={<TimelineSkeleton />}>
        <ErrorBoundary fallback={<TimelineError />}>
            <TimelineContainer />
        </ErrorBoundary>
    </React.Suspense>
);
