import { Simulering } from 'internal-types';

export const umappetSimuleringsdata = {
    totalbeløp: 9999,
    perioder: [
        {
            fom: '2020-01-01',
            tom: '2020-01-02',
            utbetalinger: [
                {
                    utbetalesTilId: '987654321',
                    utbetalesTilNavn: 'Koronavirus',
                    forfall: '2020-01-03',
                    feilkonto: true,
                    detaljer: [
                        {
                            faktiskFom: '2020-01-01',
                            faktiskTom: '2020-01-02',
                            konto: '12345678910og1112',
                            beløp: 9999,
                            tilbakeføring: false,
                            sats: 1111,
                            typeSats: 'DAGLIG',
                            antallSats: 9,
                            uføregrad: 100,
                            klassekode: 'SPREFAG-IOP',
                            klassekodeBeskrivelse: 'Sykepenger, Refusjon arbeidsgiver',
                            utbetalingstype: 'YTELSE',
                            refunderesOrgNr: '987654321',
                        },
                    ],
                },
            ],
        },
    ],
};

export const mappetSimuleringsdata: Simulering = {
    totalbeløp: 9999,
    perioder: [
        {
            fom: '2020-01-01',
            tom: '2020-01-02',
            utbetalinger: [
                {
                    utbetalesTilId: '987654321',
                    utbetalesTilNavn: 'Koronavirus',
                    forfall: '2020-01-03',
                    feilkonto: true,
                    detaljer: [
                        {
                            faktiskFom: '2020-01-01',
                            faktiskTom: '2020-01-02',
                            konto: '12345678910og1112',
                            belop: 9999,
                            tilbakeforing: false,
                            sats: 1111,
                            typeSats: 'DAGLIG',
                            antallSats: 9,
                            uforegrad: 100,
                            klassekode: 'SPREFAG-IOP',
                            klassekodeBeskrivelse: 'Sykepenger, Refusjon arbeidsgiver',
                            utbetalingsType: 'YTELSE',
                            refunderesOrgNr: '987654321',
                        },
                    ],
                },
            ],
        },
    ],
};
