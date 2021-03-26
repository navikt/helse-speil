import { SpleisSykdomsdagkildeType, SpleisSykdomsdagtype, SpleisUtbetalingsdagtype } from 'external-types';

export const umappetUtbetalingshistorikk = () => ({
    beregningId: 'id1',
    hendelsetidslinje: [
        {
            dagen: '2018-01-01',
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
            dagen: '2018-01-01',
            type: SpleisSykdomsdagtype.SYKEDAG,
            kilde: {
                type: SpleisSykdomsdagkildeType.SAKSBEHANDLER,
                kildeId: 'eed4d4f5-b629-4986-82db-391336f861e9',
            },
            grad: 100.0,
        },
    ],
    utbetalinger: [
        {
            status: 'IKKE_UTBETALT',
            utbetalingstidslinje: [
                {
                    type: SpleisUtbetalingsdagtype.NAVDAG,
                    inntekt: 1431,
                    dato: '2018-01-01',
                },
            ],
            type: 'REVURDERING',
        },
    ],
});
