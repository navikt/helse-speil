import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

import type { Arbeidsgiver, Infotrygdutbetaling } from '@io/graphql';

type Periode = {
    fom: DateString;
    tom: DateString;
};

const getAvailableZoomLevels = (latestDate: Dayjs): Array<TimelineZoomLevel> => [
    {
        fom: latestDate.subtract(2, 'month'),
        tom: latestDate,
        label: '2 mnd',
    },
    {
        fom: latestDate.subtract(6, 'month'),
        tom: latestDate,
        label: '6 mnd',
    },
    {
        fom: latestDate.subtract(1, 'year'),
        tom: latestDate,
        label: '1 år',
    },
    {
        fom: latestDate.subtract(4, 'year'),
        tom: latestDate,
        label: '4 år',
    },
];

const getLatestDate = (perioder: Array<Periode>): Dayjs => {
    return perioder.reduce((latest: Dayjs, periode: Periode) => {
        const dato = dayjs(periode.tom);
        return dato.isAfter(latest) ? dato : latest;
    }, dayjs(0));
};

const useLatestDate = (arbeidsgivere: Array<Arbeidsgiver>, infotrygdutbetalinger: Array<Infotrygdutbetaling>) => {
    return useMemo(() => {
        const perioder = [
            ...arbeidsgivere.flatMap((it) => it.generasjoner.flatMap((it) => it.perioder) ?? []),
            ...arbeidsgivere.flatMap((it) => it.ghostPerioder),
            ...infotrygdutbetalinger,
        ];
        return getLatestDate(perioder);
    }, [arbeidsgivere, infotrygdutbetalinger]);
};

const useAvailableZoomLevels = (latestDate: Dayjs) => useMemo(() => getAvailableZoomLevels(latestDate), [latestDate]);

type UseTimelineZoomResult = {
    zoomLevels: Array<TimelineZoomLevel>;
    currentZoomLevel: TimelineZoomLevel;
    setCurrentZoomLevel: (index: number) => void;
};

export const useTimelineZoom = (
    arbeidsgivere: Array<Arbeidsgiver>,
    infotrygdutbetalinger: Array<Infotrygdutbetaling>,
): UseTimelineZoomResult => {
    const [currentZoomIndex, setCurrentZoomIndex] = useState<number>(1);

    const latestDate = useLatestDate(arbeidsgivere, infotrygdutbetalinger);
    const availableZoomLevels = useAvailableZoomLevels(latestDate);

    return {
        zoomLevels: getAvailableZoomLevels(latestDate),
        currentZoomLevel: availableZoomLevels[currentZoomIndex],
        setCurrentZoomLevel: setCurrentZoomIndex,
    };
};
