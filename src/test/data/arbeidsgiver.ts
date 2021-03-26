import { umappetVedtaksperiode } from './vedtaksperiode';
import {
    SpesialistArbeidsgiver,
    SpesialistOverstyring,
    SpleisSykdomsdagkildeType,
    SpleisSykdomsdagtype,
    SpleisUtbetalingsdagtype,
} from 'external-types';

export const umappetArbeidsgiver = (
    vedtaksperioder = [umappetVedtaksperiode()],
    overstyringer: SpesialistOverstyring[] = []
): SpesialistArbeidsgiver => ({
    organisasjonsnummer: '987654321',
    id: '3fb100f2-5d3d-4a89-84cd-e123544a4400',
    navn: 'Potetsekk AS',
    bransjer: ['Sofasitting', 'TV-titting'],
    vedtaksperioder: vedtaksperioder,
    overstyringer: overstyringer,
    utbetalingshistorikk: [
        {
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
        },
    ],
});
