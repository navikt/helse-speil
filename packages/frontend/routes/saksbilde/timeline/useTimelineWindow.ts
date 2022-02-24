import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

import type { Arbeidsgiver, Infotrygdutbetaling } from '@io/graphql';

type Periode = {
    fom: DateString;
    tom: DateString;
};

const getLatestDate = (perioder: Array<Periode>): Dayjs =>
    perioder.reduce((latest: Dayjs, periode: Periode) => {
        const dato = dayjs(periode.tom);
        return dato.isAfter(latest) ? dato : latest;
    }, dayjs(0));

type UseTimelineWindowResult = {
    availableWindows: Array<TimelineWindow>;
    activeWindow: TimelineWindow;
    setActiveWindow: (window: TimelineWindow) => void;
};

export const useTimelineWindow = (
    arbeidsgivere: Array<Arbeidsgiver>,
    infotrygdutbetalinger: Array<Infotrygdutbetaling>
): UseTimelineWindowResult => {
    const latestDate = useMemo(() => {
        const perioder = [
            ...arbeidsgivere.flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? []),
            ...infotrygdutbetalinger,
        ];
        return getLatestDate(perioder);
    }, []);

    const availableWindows: Array<TimelineWindow> = [
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

    const [activeWindow, setActiveWindow] = useState<TimelineWindow>(availableWindows[0]);

    return {
        availableWindows: availableWindows,
        activeWindow,
        setActiveWindow,
    };
};
