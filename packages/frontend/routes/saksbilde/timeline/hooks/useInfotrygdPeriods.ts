import { useMemo } from 'react';
import { Infotrygdutbetaling } from '@io/graphql';

export const useInfotrygdPeriods = (
    infotrygdutbetalinger: Array<Infotrygdutbetaling>,
): Map<string, Array<InfotrygdPeriod>> =>
    useMemo(() => {
        const map = new Map<string, Array<InfotrygdPeriod>>();

        const utbetalinger = infotrygdutbetalinger.filter(
            (it) => it.typetekst !== 'Tilbakeført' && it.typetekst !== 'Ukjent..',
        );

        for (const utbetaling of utbetalinger) {
            if (!map.has(utbetaling.organisasjonsnummer)) {
                map.set(utbetaling.organisasjonsnummer, []);
            }
            map.get(utbetaling.organisasjonsnummer)?.push(utbetaling);
        }

        return map;
    }, [infotrygdutbetalinger]);
