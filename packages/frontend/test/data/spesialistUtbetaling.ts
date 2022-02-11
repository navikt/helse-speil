import { testArbeidsgiverfagsystemId, testOrganisasjonsnummer, testPersonfagsystemId } from './person';

export const umappetUtbetalinger = (): ExternalUtbetalingElement[] => [
    {
        status: 'UTBETALT',
        type: 'UTBETALING',
        arbeidsgiveroppdrag: {
            mottaker: testOrganisasjonsnummer,
            fagsystemId: testArbeidsgiverfagsystemId,
            utbetalingslinjer: [
                {
                    fom: '2018-01-17',
                    tom: '2018-01-20',
                    totalbeløp: null,
                },
            ],
        },
        annullertAvSaksbehandler: null,
        totalbeløp: null,
    },
    {
        status: 'SENDT',
        type: 'UTBETALING',
        arbeidsgiveroppdrag: {
            mottaker: testOrganisasjonsnummer,
            fagsystemId: testPersonfagsystemId,
            utbetalingslinjer: [
                {
                    fom: '2018-01-17',
                    tom: '2018-01-25',
                    totalbeløp: null,
                },
            ],
        },
        totalbeløp: null,
    },
];
