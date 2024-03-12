import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import type { Arbeidsgiver, Infotrygdutbetaling } from '@io/graphql';
import { erCoachEllerSuper } from '@utils/featureToggles';

type Periode = {
    fom: DateString;
    tom: DateString;
};

const createZoomLevel = (startDate: Dayjs, delta: number, label: string, months: number): TimelineZoomLevel => {
    return {
        fom: startDate.subtract(months * 30, 'day').add(delta, 'day'),
        tom: startDate.add(delta, 'day'),
        label: label,
    };
};

const getAvailableZoomLevels = (latestDate: Dayjs, delta: number): Array<TimelineZoomLevel> => {
    return [
        createZoomLevel(latestDate, delta, '2 mnd', 2),
        createZoomLevel(latestDate, delta, '6 mnd', 6),
        createZoomLevel(latestDate, delta, '1 år', 12),
        createZoomLevel(latestDate, delta, '4 år', 48),
    ];
};

const getLatestDate = (perioder: Array<Periode>): Dayjs => {
    return perioder.reduce((latest: Dayjs, periode: Periode) => {
        const dato = dayjs(periode.tom);
        return dato.isAfter(latest) ? dato : latest;
    }, dayjs(0));
};

const getEarliestDate = (perioder: Array<Periode>): Dayjs => {
    return perioder.reduce((latest: Dayjs, periode: Periode) => {
        const dato = dayjs(periode.fom);
        return dato.isBefore(latest) ? dato : latest;
    }, dayjs());
};

const getMergedPeriods = (
    arbeidsgivere: Array<Arbeidsgiver>,
    infotrygdutbetalinger: Array<Infotrygdutbetaling>,
): Array<Periode> => {
    return [
        ...arbeidsgivere.flatMap((it) => it.generasjoner.flatMap((it) => it.perioder) ?? []),
        ...arbeidsgivere.flatMap((it) => it.ghostPerioder),
        ...infotrygdutbetalinger,
    ];
};

const useLatestPossibleDate = (periods: Array<Periode>): Dayjs => {
    return useMemo(() => {
        return getLatestDate(periods);
    }, [periods]);
};

const useEarliestPossibleDate = (periods: Array<Periode>): Dayjs => {
    return useMemo(() => {
        return getEarliestDate(periods);
    }, [periods]);
};

const useAvailableZoomLevels = (startDate: Dayjs, delta: number) => {
    return useMemo(() => getAvailableZoomLevels(startDate, delta), [startDate, delta]);
};

const getNumberOfDaysInZoomLevel = (level: TimelineZoomLevel): number => {
    return level.tom.diff(level.fom, 'day') * (erCoachEllerSuper() ? 0.75 : 1);
};

type UseTimelineControlsResult = {
    zoomLevels: Array<TimelineZoomLevel>;
    currentZoomLevel: TimelineZoomLevel;
    setCurrentZoomLevel: Dispatch<SetStateAction<number>>;
    navigateForwards: () => void;
    navigateBackwards: () => void;
    canNavigateForwards: boolean;
    canNavigateBackwards: boolean;
};

export const useTimelineControls = (
    arbeidsgivere: Array<Arbeidsgiver>,
    infotrygdutbetalinger: Array<Infotrygdutbetaling>,
): UseTimelineControlsResult => {
    const allPeriods = useMemo(
        () => getMergedPeriods(arbeidsgivere, infotrygdutbetalinger),
        [arbeidsgivere, infotrygdutbetalinger],
    );

    const latestPossibleDate = useLatestPossibleDate(allPeriods);
    const earliestPossibleDate = useEarliestPossibleDate(allPeriods);

    const [currentZoomIndex, setCurrentZoomIndex] = useState<number>(ZoomLevel.SEKS_MÅNEDER);
    const [currentDateDelta, setCurrentDateDelta] = useState<number>(0);

    const availableZoomLevels = useAvailableZoomLevels(latestPossibleDate, currentDateDelta);

    const latestVisibleDate = latestPossibleDate.add(currentDateDelta, 'day');

    const currentZoomLevel = availableZoomLevels[currentZoomIndex];

    const updateDelta = (updater: (delta: number) => number): void => {
        console.log(currentDateDelta);
        setCurrentDateDelta((delta) => {
            const newDelta = updater(delta);
            return newDelta > 0 ? 0 : newDelta;
        });
    };

    const navigateForwards = () => {
        updateDelta((delta) => delta + getNumberOfDaysInZoomLevel(currentZoomLevel));
    };

    const navigateBackwards = () => {
        updateDelta((delta) => delta - getNumberOfDaysInZoomLevel(currentZoomLevel));
    };

    return {
        zoomLevels: availableZoomLevels,
        currentZoomLevel: currentZoomLevel,
        setCurrentZoomLevel: setCurrentZoomIndex,
        navigateForwards: navigateForwards,
        navigateBackwards: navigateBackwards,
        canNavigateForwards: !latestVisibleDate.isSame(latestPossibleDate),
        canNavigateBackwards: currentZoomLevel.fom.isAfter(earliestPossibleDate),
    };
};

export const ZoomLevel = {
    TO_MÅNEDER: 0,
    SEKS_MÅNEDER: 1,
    ETT_ÅR: 2,
    FIRE_ÅR: 3,
};
