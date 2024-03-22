export const getMockOppdrag = () => {
    return [
        {
            type: 'UTBETALING',
            status: 'UTBETALT',
            arbeidsgiveroppdrag: {
                fagsystemId: 'JEX2GC6ZBRHVFG3DUXIK4CM3P4',
                linjer: [],
                organisasjonsnummer: '839942907',
            },
            personoppdrag: {
                fodselsnummer: '20087106951',
                fagsystemId: 'TMWJ7WRR7FFXJLDW3HYJCPLF5Y',
                linjer: [
                    {
                        fom: '2021-12-17',
                        tom: '2021-12-31',
                        totalbelop: 15235,
                    },
                ],
            },
            annullering: null,
            totalbelop: 15235,
        },
        {
            type: 'REVURDERING',
            status: 'UTBETALT',
            arbeidsgiveroppdrag: {
                fagsystemId: 'JEX2GC6ZBRHVFG3DUXIK4CM3P4',
                linjer: [],
                organisasjonsnummer: '839942907',
            },
            personoppdrag: {
                fodselsnummer: '20087106951',
                fagsystemId: 'TMWJ7WRR7FFXJLDW3HYJCPLF5Y',
                linjer: [
                    {
                        fom: '2021-12-17',
                        tom: '2021-12-27',
                        totalbelop: 9695,
                    },
                    {
                        fom: '2021-12-28',
                        tom: '2021-12-30',
                        totalbelop: 3324,
                    },
                    {
                        fom: '2021-12-31',
                        tom: '2021-12-31',
                        totalbelop: 1385,
                    },
                ],
            },
            annullering: null,
            totalbelop: 14404,
        },
        {
            type: 'UTBETALING',
            status: 'UTBETALT',
            arbeidsgiveroppdrag: {
                fagsystemId: 'JEX2GC6ZBRHVFG3DUXIK4CM3P4',
                linjer: [],
                organisasjonsnummer: '839942907',
            },
            personoppdrag: {
                fodselsnummer: '20087106951',
                fagsystemId: 'TMWJ7WRR7FFXJLDW3HYJCPLF5Y',
                linjer: [
                    {
                        fom: '2021-12-17',
                        tom: '2021-12-27',
                        totalbelop: 9695,
                    },
                    {
                        fom: '2021-12-28',
                        tom: '2021-12-30',
                        totalbelop: 3324,
                    },
                    {
                        fom: '2021-12-31',
                        tom: '2022-01-05',
                        totalbelop: 5540,
                    },
                    {
                        fom: '2022-01-10',
                        tom: '2022-01-10',
                        totalbelop: 1108,
                    },
                    {
                        fom: '2022-01-11',
                        tom: '2022-01-14',
                        totalbelop: 5540,
                    },
                ],
            },
            annullering: null,
            totalbelop: 25207,
        },
    ];
};
