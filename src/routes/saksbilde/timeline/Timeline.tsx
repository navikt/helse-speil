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
import { ArbeidsgiverFragment, Infotrygdutbetaling, Maybe, PersonFragment } from '@io/graphql';
import { TilkommenInntektTimelineRows } from '@saksbilde/timeline/TilkommenInntektTimelineRows';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { TimelinePeriod } from '@typer/timeline';
import { kanGjøreTilkommenInntektEndringer } from '@utils/featureToggles';
import { isBeregnetPeriode } from '@utils/typeguards';

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
    arbeidsgivere: Array<ArbeidsgiverFragment>;
    infotrygdutbetalinger: Array<Infotrygdutbetaling>;
    activePeriod: Maybe<TimelinePeriod>;
    person: PersonFragment;
}

const useLatestDate = (
    arbeidsgivere: Array<ArbeidsgiverFragment>,
    infotrygdutbetalinger: Array<Infotrygdutbetaling>,
): dayjs.Dayjs => {
    const perioder = getMergedPeriods(arbeidsgivere, infotrygdutbetalinger);
    return useLatestPossibleDate(perioder);
};

const TimelineWithContent = ({
    arbeidsgivere,
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
    } = useTimelineControls(arbeidsgivere, infotrygdutbetalinger);
    const nyesteDag = useLatestDate(arbeidsgivere, infotrygdutbetalinger);

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
                                name={arbeidsgiver.navn}
                                arbeidsgiverIdentifikator={arbeidsgiver.organisasjonsnummer}
                                generations={arbeidsgiver.generasjoner}
                                ghostPeriods={arbeidsgiver.ghostPerioder}
                                activePeriod={activePeriod}
                                person={person}
                            />
                        ) : (
                            <TimelineRow
                                key={i}
                                start={start}
                                end={end}
                                name={arbeidsgiver.navn}
                                arbeidsgiverIdentifikator={arbeidsgiver.organisasjonsnummer}
                                periods={arbeidsgiver.generasjoner[0]?.perioder ?? []}
                                ghostPeriods={arbeidsgiver.ghostPerioder}
                                activePeriod={activePeriod}
                                alignWithExpandable={harArbeidsgiverMedFlereGenerasjoner}
                                person={person}
                            />
                        );
                    })}
                {kanGjøreTilkommenInntektEndringer() && (
                    <TilkommenInntektTimelineRows start={start} end={end} fødselsnummer={person.fodselsnummer} />
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

const TimelineContainer = (): Maybe<ReactElement> => {
    const { loading, data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const activePeriod = useActivePeriod(person);

    if (loading) {
        return <TimelineSkeleton />;
    }
    if (!person) {
        return null;
    }

    const arbeidsgivere = person.arbeidsgivere;
    const infotrygdutbetalinger = person.infotrygdutbetalinger;

    return (
        <TimelineWithContent
            arbeidsgivere={arbeidsgivere}
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
