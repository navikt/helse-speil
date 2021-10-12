import dayjs, { Dayjs } from 'dayjs';

import {
    testBeregningId,
    testArbeidsgiverfagsystemId,
    testVilkårsgrunnlagHistorikkId,
    testPersonfagsystemId,
} from './person';

export const umappetUtbetalingshistorikk = (
    beregningId: string = testBeregningId,
    vilkårsgrunnlaghistorikkId: string = testVilkårsgrunnlagHistorikkId,
    utbetalingtype: string = 'UTBETALING',
    utbetalingstatus: string = 'UTBETALT',
    opprettet: Dayjs = dayjs('2018-01-01T00:00:00'),
    dag: Dayjs = dayjs('2018-01-01'),
    vurdering: ExternalHistorikkElementUtbetaling['vurdering'] = {
        godkjent: true,
        ident: 'EN_IDENT',
        tidsstempel: opprettet.toISOString(),
        automatisk: true,
    }
): ExternalHistorikkElement => ({
    beregningId: beregningId,
    vilkårsgrunnlagHistorikkId: vilkårsgrunnlaghistorikkId,
    hendelsetidslinje: [
        {
            dagen: dag.format('YYYY-MM-DD'),
            type: 'SYKEDAG',
            kilde: {
                type: 'Saksbehandler',
                kildeId: 'eed4d4f5-b629-4986-82db-391336f861e9',
            },
            grad: 100.0,
        },
    ],
    beregnettidslinje: [
        {
            dagen: dag.format('YYYY-MM-DD'),
            type: 'SYKEDAG',
            kilde: {
                type: 'Saksbehandler',
                kildeId: 'eed4d4f5-b629-4986-82db-391336f861e9',
            },
            grad: 100.0,
        },
    ],
    tidsstempel: opprettet.toISOString(),
    utbetaling: {
        status: utbetalingstatus,
        utbetalingstidslinje: [
            {
                type: 'NavDag',
                inntekt: 1431,
                dato: dag.format('YYYY-MM-DD'),
            },
        ],
        maksdato: dag.add(2, 'month').format('YYYY-MM-DD'),
        type: utbetalingtype,
        gjenståendeSykedager: 0,
        forbrukteSykedager: 0,
        arbeidsgiverNettoBeløp: 0,
        personNettoBeløp: 0,
        arbeidsgiverFagsystemId: testArbeidsgiverfagsystemId,
        personFagsystemId: testPersonfagsystemId,
        vurdering: vurdering,
    },
});
