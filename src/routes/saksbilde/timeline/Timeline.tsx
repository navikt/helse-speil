import classNames from 'classnames';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { ReactElement, useEffect } from 'react';

import { PlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Skeleton } from '@navikt/ds-react';

import { erUtvikling } from '@/env';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { useHarTotrinnsvurdering } from '@hooks/useHarTotrinnsvurdering';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { Infotrygdutbetaling, Maybe, PersonFragment } from '@io/graphql';
import { TilkommenInntektTimelineRows } from '@saksbilde/timeline/TilkommenInntektTimelineRows';
import { Inntektsforhold } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { finnInntektsforholdForPerson } from '@state/selectors/arbeidsgiver';
import { TimelinePeriod } from '@typer/timeline';
import { kanGjøreTilkommenInntektEndringer } from '@utils/featureToggles';
import { isArbeidsgiver, isBeregnetPeriode } from '@utils/typeguards';

import { ExpandableTimelineRow } from './ExpandableTimelineRow';
import { InfotrygdRow } from './InfotrygdRow';
import { Labels, LabelsSkeleton } from './Labels';
import { Pins } from './Pins';
import { ScrollButtons } from './ScrollButtons';
import { TimelineRow, TimelineRowSkeleton } from './TimelineRow';
import { ZoomLevelPicker } from './ZoomLevelPicker';
import { useInfotrygdPeriods } from './hooks/useInfotrygdPeriods';
import { ZoomLevel, getMergedPeriods, useLatestPossibleDate, useTimelineControls } from './hooks/useTimelineControls';

import styles from './Timeline.module.css';

interface TimelineWithContentProps {
    inntektsforhold: Array<Inntektsforhold>;
    infotrygdutbetalinger: Array<Infotrygdutbetaling>;
    activePeriod: Maybe<TimelinePeriod>;
    person: PersonFragment;
}

const useLatestDate = (
    inntektsforhold: Array<Inntektsforhold>,
    infotrygdutbetalinger: Array<Infotrygdutbetaling>,
): dayjs.Dayjs => {
    const perioder = getMergedPeriods(inntektsforhold, infotrygdutbetalinger);
    return useLatestPossibleDate(perioder);
};

const TimelineWithContent = ({
    inntektsforhold,
    infotrygdutbetalinger,
    activePeriod,
    person,
}: TimelineWithContentProps): ReactElement => {
    const {
        zoomLevels,
        currentZoomLevel,
        setCurrentZoomLevel,
        navigateForwards,
        navigateBackwards,
        canNavigateForwards,
        canNavigateBackwards,
    } = useTimelineControls(inntektsforhold, infotrygdutbetalinger);
    const nyesteDag = useLatestDate(inntektsforhold, infotrygdutbetalinger);

    useEffect(() => {
        const defaultZoomLevel = () => {
            if (isBeregnetPeriode(activePeriod)) {
                if (dayjs(activePeriod.fom).isSameOrBefore(nyesteDag.subtract(1, 'year'))) return ZoomLevel.FIRE_ÅR;
                else if (dayjs(activePeriod.fom).isSameOrBefore(nyesteDag.subtract(6, 'month')))
                    return ZoomLevel.ETT_ÅR;
            }
            return ZoomLevel.SEKS_MÅNEDER;
        };
        setCurrentZoomLevel(defaultZoomLevel());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useKeyboard([
        {
            key: Key.Minus,
            action: navigateForwards,
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
        {
            key: Key.NumpadAdd,
            action: navigateForwards,
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
        {
            key: Key.Slash,
            action: canNavigateBackwards ? navigateBackwards : () => {},
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
        {
            key: Key.NumpadSubtract,
            action: canNavigateBackwards ? navigateBackwards : () => {},
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

    const erBeslutteroppgave = useHarTotrinnsvurdering(person);
    const start = currentZoomLevel.fom.startOf('day');
    const end = currentZoomLevel.tom.endOf('day');

    const infotrygdPeriods = useInfotrygdPeriods(infotrygdutbetalinger);
    const harArbeidsgiverMedFlereGenerasjoner = inntektsforhold.some(
        (arbeidsgiver) => arbeidsgiver.generasjoner.length > 1,
    );

    return (
        <div className={styles.Timeline}>
            <Pins start={start} end={end} inntektsforhold={inntektsforhold} />
            <Labels start={start} end={end} />
            <div className={styles.Rows}>
                {inntektsforhold
                    .filter(
                        (inntektsforhold) =>
                            inntektsforhold.generasjoner.length > 0 ||
                            (isArbeidsgiver(inntektsforhold) && inntektsforhold.ghostPerioder.length > 0),
                    )
                    .map((inntektsforhold, i) => {
                        return inntektsforhold.generasjoner.length > 1 ? (
                            <ExpandableTimelineRow
                                key={i}
                                start={start}
                                end={end}
                                generations={inntektsforhold.generasjoner}
                                activePeriod={activePeriod}
                                person={person}
                                inntektsforhold={inntektsforhold}
                            />
                        ) : (
                            <TimelineRow
                                key={i}
                                start={start}
                                end={end}
                                activePeriod={activePeriod}
                                alignWithExpandable={harArbeidsgiverMedFlereGenerasjoner}
                                person={person}
                                inntektsforhold={inntektsforhold}
                            />
                        );
                    })}
                {kanGjøreTilkommenInntektEndringer() && (
                    <TilkommenInntektTimelineRows start={start} end={end} aktørId={person.aktorId} />
                )}
                {infotrygdPeriods.length > 0 && (
                    <InfotrygdRow
                        start={start}
                        end={end}
                        periods={infotrygdPeriods}
                        alignWithExpandable={harArbeidsgiverMedFlereGenerasjoner}
                        person={person}
                    />
                )}
            </div>
            <div className={styles.TimelineButtons}>
                <div className={styles.LeftButtons}>
                    {erUtvikling && !erBeslutteroppgave && (
                        <Button
                            as={NextLink}
                            variant="tertiary"
                            size="small"
                            style={{ marginLeft: '-0.5rem' }}
                            icon={<PlusIcon title="Legg til tilkommen inntekt" />}
                            href={`/person/${person.aktorId}/tilkommeninntekt/ny`}
                        >
                            Legg til tilkommen inntekt/periode
                        </Button>
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
        </div>
    );
};

const TimelineContainer = (): ReactElement | null => {
    const { loading, data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const activePeriod = useActivePeriod(person);

    if (loading) {
        return <TimelineSkeleton />;
    }
    if (!person) {
        return null;
    }

    const inntektsforhold = finnInntektsforholdForPerson(person);
    const infotrygdutbetalinger = person.infotrygdutbetalinger;

    return (
        <TimelineWithContent
            inntektsforhold={inntektsforhold}
            infotrygdutbetalinger={infotrygdutbetalinger ?? []}
            activePeriod={activePeriod}
            person={person}
        />
    );
};

const TimelineSkeleton = (): ReactElement => {
    return (
        <div className={styles.Timeline}>
            <LabelsSkeleton />
            <div className={styles.Rows}>
                <TimelineRowSkeleton />
                {erUtvikling && <TimelineRowSkeleton />}
            </div>
            <div className={styles.TimelineButtons}>
                <div className={styles.LeftButtons}>
                    {erUtvikling && <Skeleton variant="rectangle" width="250px" />}
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
        </div>
    );
};

const TimelineError = (): ReactElement => {
    return (
        <div className={classNames(styles.Timeline, styles.Error)}>
            <BodyShort>Det har skjedd en feil. Kan ikke vise tidslinjen for denne personen.</BodyShort>
        </div>
    );
};

export const Timeline = (): ReactElement => (
    <ErrorBoundary fallback={<TimelineError />}>
        <TimelineContainer />
    </ErrorBoundary>
);
