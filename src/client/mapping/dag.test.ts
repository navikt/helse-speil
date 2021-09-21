import dayjs from 'dayjs';

import { mapSykdomstidslinje, mapUtbetalingstidslinje } from './dag';
import { somDato } from './vedtaksperiode';

const enUmappetSykdomstidlinje: ExternalSykdomsdag[] = [
    {
        dagen: '2020-01-01',
        type: 'ARBEIDSDAG',
        kilde: {
            type: 'Inntektsmelding',
            kildeId: 'en-inntektsmelding',
        },
    },
    {
        dagen: '2020-01-02',
        type: 'SYKEDAG',
        kilde: {
            type: 'Søknad',
            kildeId: 'en-søknad',
        },
        grad: 100,
    },
    {
        dagen: '2020-01-03',
        type: 'FERIEDAG',
        kilde: {
            type: 'Søknad',
            kildeId: 'en-søknad',
        },
    },
    {
        dagen: '2020-01-04',
        type: 'STUDIEDAG',
        kilde: {
            type: 'Søknad',
            kildeId: 'en-søknad',
        },
    },
    {
        dagen: '2020-01-05',
        type: 'SYK_HELGEDAG_SØKNAD',
    },
    {
        dagen: '2020-01-06',
        type: 'ARBEIDSGIVERDAG',
        kilde: {
            type: 'Inntektsmelding',
            kildeId: 'en-inntektsmelding',
        },
    },
    {
        dagen: '2020-01-07',
        type: 'FORELDET_SYKEDAG',
        kilde: {
            type: 'Sykmelding',
            kildeId: 'en-sykmelding',
        },
        grad: 100,
    },
    {
        dagen: '2020-01-08',
        type: 'ANNULLERT_DAG',
        kilde: {
            type: 'Saksbehandler',
            kildeId: 'en-saksbehandler',
        },
    },
];

const enMappetSykdomstidlinje: Sykdomsdag[] = [
    {
        type: 'Arbeidsdag',
        dato: somDato('2020-01-01'),
        gradering: undefined,
        kilde: 'Inntektsmelding',
        kildeId: 'en-inntektsmelding',
    },
    {
        type: 'Syk',
        dato: somDato('2020-01-02'),
        gradering: 100,
        kilde: 'Søknad',
        kildeId: 'en-søknad',
    },
    {
        type: 'Ferie',
        dato: somDato('2020-01-03'),
        gradering: undefined,
        kilde: 'Søknad',
        kildeId: 'en-søknad',
    },
    {
        type: 'Ubestemt',
        dato: somDato('2020-01-04'),
        gradering: undefined,
        kilde: 'Søknad',
        kildeId: 'en-søknad',
    },
    {
        type: 'Helg',
        dato: somDato('2020-01-05'),
        gradering: undefined,
        kilde: 'Søknad',
        kildeId: undefined,
    },
    {
        type: 'Egenmelding',
        dato: somDato('2020-01-06'),
        gradering: undefined,
        kilde: 'Inntektsmelding',
        kildeId: 'en-inntektsmelding',
    },
    {
        type: 'Foreldet',
        dato: somDato('2020-01-07'),
        gradering: 100,
        kilde: 'Sykmelding',
        kildeId: 'en-sykmelding',
    },
    {
        type: 'Annullert',
        dato: somDato('2020-01-08'),
        gradering: undefined,
        kilde: 'Saksbehandler',
        kildeId: 'en-saksbehandler',
    },
];

test('mapSykdomstidslinje', () => {
    expect(mapSykdomstidslinje(enUmappetSykdomstidlinje)).toEqual(enMappetSykdomstidlinje);
});

describe('mapUtbetalingstidslinje', () => {
    test('mapper navdager', () => {
        const umappet: ExternalUtbetalingsdag = {
            type: 'NavDag',
            inntekt: 1234,
            dato: '2020-01-01',
            utbetaling: 1234,
            grad: 100,
            begrunnelser: undefined,
        };
        const mappet = {
            type: 'Syk',
            utbetaling: 1234,
            dato: dayjs('2020-01-01'),
            gradering: 100,
            avvistÅrsaker: undefined,
        };
        expect(mapUtbetalingstidslinje([umappet], {} as ExternalVedtaksperiode['vilkår'])).toEqual([mappet]);
    });
    test('mapper avviste dager', () => {
        const umappet: ExternalUtbetalingsdag = {
            type: 'AvvistDag',
            inntekt: 1234,
            dato: '2020-01-01',
            utbetaling: 0,
            grad: 100,
            begrunnelser: ['EtterDødsdato'],
        };
        const mappet: Utbetalingsdag = {
            type: 'Avslått',
            utbetaling: 0,
            dato: dayjs('2020-01-01'),
            gradering: 100,
            avvistÅrsaker: [
                {
                    tekst: 'EtterDødsdato',
                    paragraf: undefined,
                },
            ],
        };
        const vilkår = { alder: { alderSisteSykedag: 20 } } as ExternalVedtaksperiode['vilkår'];
        expect(mapUtbetalingstidslinje([umappet], vilkår)).toEqual([mappet]);
    });
    test('mapper avviste dager med paragraf 8-51', () => {
        const umappet: ExternalUtbetalingsdag = {
            type: 'AvvistDag',
            inntekt: 1234,
            dato: '2020-01-01',
            utbetaling: 0,
            grad: 100,
            begrunnelser: ['Fordi'],
        };
        const mappet = {
            type: 'Avslått',
            utbetaling: 0,
            dato: dayjs('2020-01-01'),
            gradering: 100,
            avvistÅrsaker: [
                {
                    tekst: 'Fordi',
                    paragraf: '8-51',
                },
            ],
        };
        const vilkår = { alder: { alderSisteSykedag: 67 } } as ExternalVedtaksperiode['vilkår'];
        expect(mapUtbetalingstidslinje([umappet], vilkår)).toEqual([mappet]);
    });
    test('mapper avviste dager med flere begrunnelser', () => {
        const umappet: ExternalUtbetalingsdag = {
            type: 'AvvistDag',
            inntekt: 1234,
            dato: '2020-01-01',
            utbetaling: 0,
            grad: 100,
            begrunnelser: ['Fordi', 'Derfor', 'Sånn er det'],
        };
        const mappet = {
            type: 'Avslått',
            utbetaling: 0,
            dato: dayjs('2020-01-01'),
            gradering: 100,
            avvistÅrsaker: [
                {
                    tekst: 'Fordi',
                    paragraf: undefined,
                },
                {
                    tekst: 'Derfor',
                    paragraf: undefined,
                },
                {
                    tekst: 'Sånn er det',
                    paragraf: undefined,
                },
            ],
        };
        const vilkår = { alder: { alderSisteSykedag: 20 } } as ExternalVedtaksperiode['vilkår'];
        expect(mapUtbetalingstidslinje([umappet], vilkår)).toEqual([mappet]);
    });
});
