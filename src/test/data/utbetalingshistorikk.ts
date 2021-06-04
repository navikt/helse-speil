import dayjs, { Dayjs } from 'dayjs';
import { SpleisSykdomsdagkildeType, SpleisSykdomsdagtype, SpleisUtbetalingsdagtype } from 'external-types';

export const umappetUtbetalingshistorikk = (
    beregningId: string = 'id1',
    utbetalingtype: string = 'UTBETALING',
    utbetalingstatus: string = 'UTBETALT',
    opprettet: Dayjs = dayjs('2020-01-01T00:00:00'),
    dag: Dayjs = dayjs('2020-01-01')
) => ({
    beregningId: beregningId,
    hendelsetidslinje: [
        {
            dagen: dag.format('YYYY-MM-DD'),
            type: SpleisSykdomsdagtype.SYKEDAG,
            kilde: {
                type: SpleisSykdomsdagkildeType.SAKSBEHANDLER,
                kildeId: 'eed4d4f5-b629-4986-82db-391336f861e9',
            },
            grad: 100.0,
        },
    ],
    beregnettidslinje: [
        {
            dagen: dag.format('YYYY-MM-DD'),
            type: SpleisSykdomsdagtype.SYKEDAG,
            kilde: {
                type: SpleisSykdomsdagkildeType.SAKSBEHANDLER,
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
                type: SpleisUtbetalingsdagtype.NAVDAG,
                inntekt: 1431,
                dato: dag.format('YYYY-MM-DD'),
            },
        ],
        maksdato: dag.add(2, 'month').format('YYYY-MM-DD'),
        type: utbetalingtype,
        gjenståendeSykedager: 0,
        forbrukteSykedager: 0,
        arbeidsgiverNettoBeløp: 0,
        arbeidsgiverFagsystemId: 'EN_FAGSYSTEMID',
        vurdering: {
            godkjent: true,
            ident: 'EN_IDENT',
            tidsstempel: '2018-01-01',
            automatisk: true,
        },
    },
});
