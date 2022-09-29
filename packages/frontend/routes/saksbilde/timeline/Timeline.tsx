import React from 'react';
import classNames from 'classnames';
import { BodyShort } from '@navikt/ds-react';

import { Pins } from './Pins';
import { Labels } from './Labels';
import { TimelineRow } from './TimelineRow';
import { ScrollButtons } from './ScrollButtons';
import { InfotrygdRow } from './InfotrygdRow';
import { ZoomLevelPicker } from './ZoomLevelPicker';
import { useTimelineControls } from './hooks/useTimelineControls';
import { useInfotrygdPeriods } from './hooks/useInfotrygdPeriods';
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

const TimelineWithContent: React.VFC<TimelineWithContentProps> = React.memo(
    ({ arbeidsgivere, infotrygdutbetalinger, activePeriod }) => {
        const {
            zoomLevels,
            currentZoomLevel,
            setCurrentZoomLevel,
            navigateForwards,
            navigateBackwards,
            canNavigateForwards,
            canNavigateBackwards,
        } = useTimelineControls(arbeidsgivere, infotrygdutbetalinger);

        const start = currentZoomLevel.fom.startOf('day');
        const end = currentZoomLevel.tom.endOf('day');

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
                                    activePeriod={activePeriod}
                                />
                            ) : (
                                <TimelineRow
                                    key={i}
                                    start={start}
                                    end={end}
                                    name={arbeidsgiver.navn ?? arbeidsgiver.organisasjonsnummer}
                                    periods={arbeidsgiver.generasjoner[0]?.perioder ?? []}
                                    ghostPeriods={arbeidsgiver.ghostPerioder}
                                    activePeriod={activePeriod}
                                />
                            ),
                        )}
                    {infotrygdPeriods.length && <InfotrygdRow start={start} end={end} periods={infotrygdPeriods} />}
                </div>
                <div className={styles.TimelineControls}>
                    <ScrollButtons
                        navigateForwards={navigateForwards}
                        navigateBackwards={navigateBackwards}
                        canNavigateForwards={canNavigateForwards}
                        canNavigateBackwards={canNavigateBackwards}
                    />
                    <ZoomLevelPicker
                        currentZoomLevel={currentZoomLevel}
                        availableZoomLevels={zoomLevels}
                        setActiveZoomLevel={setCurrentZoomLevel}
                    />
                </div>
            </div>
        );
    },
);

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
