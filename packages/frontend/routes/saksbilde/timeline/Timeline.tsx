import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { Arbeidsgiver, Infotrygdutbetaling } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson, useIsFetchingPerson } from '@state/person';
import { isBeregnetPeriode } from '@utils/typeguards';

import { ExpandableTimelineRow } from './ExpandableTimelineRow';
import { InfotrygdRow } from './InfotrygdRow';
import { Labels, LabelsSkeleton } from './Labels';
import { Pins } from './Pins';
import { ScrollButtons } from './ScrollButtons';
import { TimelineRow, TimelineRowSkeleton } from './TimelineRow';
import { ZoomLevelPicker } from './ZoomLevelPicker';
import { useInfotrygdPeriods } from './hooks/useInfotrygdPeriods';
import { ZoomLevel, useTimelineControls } from './hooks/useTimelineControls';

import styles from './Timeline.module.css';

interface TimelineWithContentProps {
    arbeidsgivere: Array<Arbeidsgiver>;
    infotrygdutbetalinger: Array<Infotrygdutbetaling>;
    activePeriod: TimelinePeriod | null;
}

const TimelineWithContent: React.FC<TimelineWithContentProps> = React.memo(
    ({ arbeidsgivere, infotrygdutbetalinger, activePeriod }) => {
        useEffect(() => {
            const defaultZoomLevel = () => {
                if (isBeregnetPeriode(activePeriod)) {
                    if (dayjs(activePeriod.fom).isSameOrBefore(dayjs(Date.now()).subtract(1, 'year')))
                        return ZoomLevel.FIRE_ÅR;
                    else if (dayjs(activePeriod.fom).isSameOrBefore(dayjs(Date.now()).subtract(6, 'month')))
                        return ZoomLevel.ETT_ÅR;
                    else return ZoomLevel.SEKS_MÅNEDER;
                }
                return ZoomLevel.SEKS_MÅNEDER;
            };
            setCurrentZoomLevel(defaultZoomLevel());
        }, []);

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
        const harArbeidsgiverMedFlereGenerasjoner = arbeidsgivere.some(
            (arbeidsgiver) => arbeidsgiver.generasjoner.length > 1,
        );

        return (
            <div className={styles.Timeline}>
                <Pins start={start} end={end} arbeidsgivere={arbeidsgivere} />
                <Labels start={start} end={end} />
                <div className={styles.Rows}>
                    {arbeidsgivere
                        .filter((it) => it.generasjoner.length > 0 || it.ghostPerioder.length > 0)
                        .map((arbeidsgiver, i) => {
                            return arbeidsgiver.generasjoner.length > 1 ? (
                                <ExpandableTimelineRow
                                    key={i}
                                    start={start}
                                    end={end}
                                    name={arbeidsgiver.navn ?? arbeidsgiver.organisasjonsnummer}
                                    generations={arbeidsgiver.generasjoner}
                                    ghostPeriods={arbeidsgiver.ghostPerioder}
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
                                    alignWithExpandable={harArbeidsgiverMedFlereGenerasjoner}
                                />
                            );
                        })}
                    {infotrygdPeriods.length > 0 && (
                        <InfotrygdRow
                            start={start}
                            end={end}
                            periods={infotrygdPeriods}
                            alignWithExpandable={harArbeidsgiverMedFlereGenerasjoner}
                        />
                    )}
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

const TimelineContainer: React.FC = () => {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();
    const arbeidsgivere = currentPerson?.arbeidsgivere;
    const infotrygdutbetalinger = currentPerson?.infotrygdutbetalinger;

    const isLoading = useIsFetchingPerson();

    if (isLoading) {
        return <TimelineSkeleton />;
    }

    if (!arbeidsgivere) {
        return null;
    }

    return (
        <TimelineWithContent
            arbeidsgivere={arbeidsgivere}
            infotrygdutbetalinger={infotrygdutbetalinger ?? []}
            activePeriod={activePeriod}
        />
    );
};

const TimelineSkeleton: React.FC = () => {
    return (
        <div className={styles.Timeline}>
            <LabelsSkeleton />
            <div className={styles.Rows}>
                <TimelineRowSkeleton />
            </div>
            <div className={styles.TimelineControls}>
                <ScrollButtons
                    navigateForwards={() => null}
                    navigateBackwards={() => null}
                    canNavigateForwards={false}
                    canNavigateBackwards={false}
                />
                <LoadingShimmer className={styles.LoadingZoomLevelPicker} />
            </div>
        </div>
    );
};

const TimelineError: React.FC = () => {
    return (
        <div className={classNames(styles.Timeline, styles.Error)}>
            <BodyShort>Det har skjedd en feil. Kan ikke vise tidslinjen for denne saken.</BodyShort>
        </div>
    );
};

export const Timeline: React.FC = () => (
    <ErrorBoundary fallback={<TimelineError />}>
        <TimelineContainer />
    </ErrorBoundary>
);
