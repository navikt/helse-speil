import { useMemo } from 'react';
import { Infotrygdutbetaling } from '@io/graphql';

export const useInfotrygdPeriods = (
    infotrygdutbetalinger: Array<Infotrygdutbetaling>
): Map<string, Array<InfotrygdPeriod>> =>
    useMemo(() => {
        const map = new Map<string, Array<InfotrygdPeriod>>();

        for (const utbetaling of infotrygdutbetalinger) {
            if (!map.has(utbetaling.organisasjonsnummer)) {
                map.set(utbetaling.organisasjonsnummer, []);
            }
            map.get(utbetaling.organisasjonsnummer)?.push(utbetaling);
        }

        return map;
    }, [infotrygdutbetalinger]);
