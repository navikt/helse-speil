import { useMemo } from 'react';

import { InfotrygdPeriod } from '@/types/shared';
import { Infotrygdutbetaling } from '@io/graphql';
import { somDato } from '@utils/date';

export const useInfotrygdPeriods = (infotrygdutbetalinger: Array<Infotrygdutbetaling>): Array<InfotrygdPeriod> =>
    useMemo(() => {
        const utbetalinger = infotrygdutbetalinger
            .filter((it) => !['Tilbakeført', 'Ukjent..'].includes(it.typetekst))
            .sort((u1, u2) => dateAscending(u1.fom, u2.fom));

        const sammenslåtteUtbetalingsperioder: Array<Infotrygdutbetaling> = [];
        let utbetaling: Infotrygdutbetaling | undefined = utbetalinger[0];

        while (utbetaling !== undefined) {
            let tom: string = utbetaling.tom;
            let søkEtterSenereTomForBerørteUtbetalinger = true;

            while (søkEtterSenereTomForBerørteUtbetalinger) {
                const senesteTomForBerørteUtbetalinger = utbetalinger
                    .filter((it) => utbetalingUtenGapTilDato(it, tom))
                    .map((it) => it.tom)
                    .sort(dateDecending)[0];

                if (somDato(senesteTomForBerørteUtbetalinger).isAfter(somDato(tom))) {
                    tom = senesteTomForBerørteUtbetalinger;
                } else {
                    søkEtterSenereTomForBerørteUtbetalinger = false;
                }
            }

            const sammenslåttUtbetalingsperiode = { ...utbetaling, tom: tom };
            sammenslåtteUtbetalingsperioder.push(sammenslåttUtbetalingsperiode);

            utbetaling = utbetalinger
                .filter((it) => somDato(it.fom).isAfter(somDato(tom).add(1, 'day')))
                .sort((a, b) => dateAscending(a.fom, b.fom))[0];
        }

        return sammenslåtteUtbetalingsperioder;
    }, [infotrygdutbetalinger]);

const dateAscending = (d1: string, d2: string): number => (somDato(d1).isBefore(somDato(d2)) ? -1 : 1);
const dateDecending = (d1: string, d2: string): number => dateAscending(d1, d2) * -1;

const utbetalingUtenGapTilDato = (utbetaling: Infotrygdutbetaling, dato: string): boolean => {
    return (
        somDato(utbetaling.fom).isSameOrBefore(somDato(dato)) ||
        somDato(utbetaling.fom).isSame(somDato(dato).add(1, 'day'))
    );
};
