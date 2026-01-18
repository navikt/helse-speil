import dayjs, { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { Infotrygdutbetaling } from '@io/graphql';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { DateString } from '@typer/shared';
import { TimelineZoomLevel } from '@typer/timeline';
import { isArbeidsgiver } from '@utils/typeguards';

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

const getAvailableZoomLevels = (latestDate: Dayjs, delta: number): TimelineZoomLevel[] => {
    return [
        createZoomLevel(latestDate, delta, '2 mnd', 2),
        createZoomLevel(latestDate, delta, '6 mnd', 6),
        createZoomLevel(latestDate, delta, '1 år', 12),
        createZoomLevel(latestDate, delta, '4 år', 48),
    ];
};

const getLatestDate = (perioder: Periode[]): Dayjs => {
    return perioder.reduce((latest: Dayjs, periode: Periode) => {
        const dato = dayjs(periode.tom);
        return dato.isAfter(latest) ? dato : latest;
    }, dayjs(0));
};

const getEarliestDate = (perioder: Periode[]): Dayjs => {
    return perioder.reduce((latest: Dayjs, periode: Periode) => {
        const dato = dayjs(periode.fom);
        return dato.isBefore(latest) ? dato : latest;
    }, dayjs());
};

export const getMergedPeriods = (
    inntektsforhold: Inntektsforhold[],
    infotrygdutbetalinger: Infotrygdutbetaling[],
): Periode[] => {
    return [
        ...inntektsforhold.flatMap((it) => it.behandlinger.flatMap((it) => it.perioder) ?? []),
        ...inntektsforhold.flatMap((it) => (isArbeidsgiver(it) ? it.ghostPerioder : [])),
        ...infotrygdutbetalinger,
    ];
};

export const useLatestPossibleDate = (periods: Periode[]): Dayjs => {
    return useMemo(() => {
        return getLatestDate(periods);
    }, [periods]);
};

const useEarliestPossibleDate = (periods: Periode[]): Dayjs => {
    return useMemo(() => {
        return getEarliestDate(periods);
    }, [periods]);
};

const useAvailableZoomLevels = (startDate: Dayjs, delta: number) => {
    return useMemo(() => getAvailableZoomLevels(startDate, delta), [startDate, delta]);
};

const getNumberOfDaysInZoomLevel = (level: TimelineZoomLevel): number => {
    return level.tom.diff(level.fom, 'day') * 0.75;
};

type UseTimelineControlsResult = {
    zoomLevels: TimelineZoomLevel[];
    currentZoomLevel: TimelineZoomLevel;
    setCurrentZoomLevel: Dispatch<SetStateAction<number>>;
    navigateForwards: () => void;
    navigateBackwards: () => void;
    canNavigateForwards: boolean;
    canNavigateBackwards: boolean;
};

export const useTimelineControls = (
    inntektsforhold: Inntektsforhold[],
    infotrygdutbetalinger: Infotrygdutbetaling[],
    initialZoomLevel: number = ZoomLevel.SEKS_MÅNEDER,
): UseTimelineControlsResult => {
    const allPeriods = useMemo(
        () => getMergedPeriods(inntektsforhold, infotrygdutbetalinger),
        [inntektsforhold, infotrygdutbetalinger],
    );

    const latestPossibleDate = useLatestPossibleDate(allPeriods);
    const earliestPossibleDate = useEarliestPossibleDate(allPeriods);

    const [currentZoomIndex, setCurrentZoomIndex] = useState<number>(initialZoomLevel);
    const [currentDateDelta, setCurrentDateDelta] = useState<number>(0);

    const availableZoomLevels = useAvailableZoomLevels(latestPossibleDate, currentDateDelta);

    const latestVisibleDate = latestPossibleDate.add(currentDateDelta, 'day');

    const currentZoomLevel = availableZoomLevels[currentZoomIndex];

    if (currentZoomLevel == undefined) throw new Error('Klarer ikke finne zoom level for periodevisning');

    const updateDelta = (updater: (delta: number) => number): void => {
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
