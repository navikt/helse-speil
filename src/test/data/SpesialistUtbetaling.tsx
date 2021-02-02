import { SpesialistUtbetaling } from 'external-types';

export const umappetUtbetalinger = (): SpesialistUtbetaling[] => [
    {
        status: 'UTBETALT',
        type: 'UTBETALING',
        arbeidsgiverOppdrag: {
            organisasjonsnummer: '987654321',
            fagsystemId: '6CFURRBEWJF3VGP5Q4BUTO6ABM',
            utbetalingslinjer: [
                {
                    fom: '2020-01-17',
                    tom: '2020-01-20',
                },
            ],
        }
    },
    {
        status: 'SENDT',
        type: 'UTBETALING',
        arbeidsgiverOppdrag: {
            organisasjonsnummer: '987654321',
            fagsystemId: '6CFURRBEWJF3VGP5Q4BUTO6ABM',
            utbetalingslinjer: [
                {
                    fom: '2020-01-17',
                    tom: '2020-01-25',
                },
            ],
        }
    },
];
