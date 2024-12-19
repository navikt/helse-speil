import dayjs from 'dayjs';

import { getOppkuttedePerioder } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/minimumSykdomsgrad';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode } from '@test-data/periode';
import { ISO_DATOFORMAT } from '@utils/date';

describe('minimumSykdomsgrad', () => {
    describe('getOppkuttedePerioder', () => {
        it('skal returnere en periode for to identisk overlappende perioder', () => {
            const aktivPeriode = enBeregnetPeriode();
            const overlappendePeriode = enBeregnetPeriode();

            const arbeidsgivere = [
                enArbeidsgiver().medPerioder([aktivPeriode]),
                enArbeidsgiver().medPerioder([overlappendePeriode]),
            ];

            const result = getOppkuttedePerioder(arbeidsgivere, aktivPeriode);

            expect(result).toEqual([{ fom: aktivPeriode.fom, tom: aktivPeriode.tom }]);
        });
        it('skal klippe opp i to perioder om perioder overlapper med lik fom og foskjellig tom', () => {
            const fellesFomDate = dayjs('2020-01-01');
            const fellesFom = fellesFomDate.format(ISO_DATOFORMAT);
            const førsteTomDate = fellesFomDate.add(1, 'week');
            const førsteTom = førsteTomDate.format(ISO_DATOFORMAT);
            const andreTom = fellesFomDate.add(2, 'weeks').format(ISO_DATOFORMAT);
            const skjæringspunkt = førsteTomDate.add(1, 'day').format(ISO_DATOFORMAT);

            const overlappendePeriode = enBeregnetPeriode({
                fom: fellesFom,
                tom: førsteTom,
            });
            const aktivPeriode = enBeregnetPeriode({ fom: fellesFom, tom: andreTom });

            const arbeidsgivere = [
                enArbeidsgiver().medPerioder([aktivPeriode]),
                enArbeidsgiver().medPerioder([overlappendePeriode]),
            ];

            const result = getOppkuttedePerioder(arbeidsgivere, aktivPeriode);

            expect(result).toEqual([
                { fom: fellesFom, tom: førsteTom },
                { fom: skjæringspunkt, tom: andreTom },
            ]);
        });
        it('skal klippe opp i to perioder om perioder overlapper med lik fom og foskjellig fom', () => {
            const førsteFomDate = dayjs('2020-01-01');
            const førsteFom = førsteFomDate.format(ISO_DATOFORMAT);
            const andreFomDate = førsteFomDate.add(1, 'week');
            const andreFom = andreFomDate.format(ISO_DATOFORMAT);
            const fellesTom = andreFomDate.add(1, 'week').format(ISO_DATOFORMAT);
            const skjæringspunkt = andreFomDate.subtract(1, 'day').format(ISO_DATOFORMAT);

            const aktivPeriode = enBeregnetPeriode({ fom: førsteFom, tom: fellesTom });
            const overlappendePeriode = enBeregnetPeriode({
                fom: andreFom,
                tom: fellesTom,
            });

            const arbeidsgivere = [
                enArbeidsgiver().medPerioder([aktivPeriode]),
                enArbeidsgiver().medPerioder([overlappendePeriode]),
            ];

            const result = getOppkuttedePerioder(arbeidsgivere, aktivPeriode);

            expect(result).toEqual([
                { fom: førsteFom, tom: skjæringspunkt },
                { fom: andreFom, tom: fellesTom },
            ]);
        });
        it('skal klippe opp i tre perioder om den ene perioden er innenfor den andre', () => {
            const yttersteFomDate = dayjs('2020-01-01');
            const yttersteFom = dayjs('2020-01-01').format(ISO_DATOFORMAT);
            const innersteFomDate = yttersteFomDate.add(1, 'week');
            const innersteFom = yttersteFomDate.add(1, 'week').format(ISO_DATOFORMAT);
            const innersteTomDate = yttersteFomDate.add(2, 'week');
            const innersteTom = yttersteFomDate.add(2, 'week').format(ISO_DATOFORMAT);
            const yttersteTom = yttersteFomDate.add(3, 'week').format(ISO_DATOFORMAT);
            const førsteSkjæringspunkt = innersteFomDate.subtract(1, 'day').format(ISO_DATOFORMAT);
            const andreSkjæringspunkt = innersteTomDate.add(1, 'day').format(ISO_DATOFORMAT);

            const aktivPeriode = enBeregnetPeriode({ fom: yttersteFom, tom: yttersteTom });
            const overlappendePeriode = enBeregnetPeriode({ fom: innersteFom, tom: innersteTom });

            const arbeidsgivere = [
                enArbeidsgiver().medPerioder([aktivPeriode]),
                enArbeidsgiver().medPerioder([overlappendePeriode]),
            ];

            const result = getOppkuttedePerioder(arbeidsgivere, aktivPeriode);

            expect(result).toEqual([
                { fom: yttersteFom, tom: førsteSkjæringspunkt },
                { fom: innersteFom, tom: innersteTom },
                { fom: andreSkjæringspunkt, tom: yttersteTom },
            ]);
        });
    });
});
