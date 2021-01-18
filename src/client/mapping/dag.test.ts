import {
    SpleisSykdomsdagkildeType,
    SpleisSykdomsdagtype,
    SpleisUtbetalingsdagtype,
    SpleisVilkår,
} from 'external-types';
import { mapSykdomstidslinje, mapUtbetalingstidslinje } from './dag';
import { Dagtype, Kildetype } from 'internal-types';
import { somDato } from './vedtaksperiode';
import dayjs from 'dayjs';

const enUmappetSykdomstidlinje = [
    {
        dagen: '2020-01-01',
        type: SpleisSykdomsdagtype.ARBEIDSDAG,
        kilde: {
            type: SpleisSykdomsdagkildeType.INNTEKTSMELDING,
            kildeId: 'en-inntektsmelding',
        },
    },
    {
        dagen: '2020-01-02',
        type: SpleisSykdomsdagtype.SYKEDAG,
        kilde: {
            type: SpleisSykdomsdagkildeType.SØKNAD,
            kildeId: 'en-søknad',
        },
        grad: 100,
    },
    {
        dagen: '2020-01-03',
        type: SpleisSykdomsdagtype.FERIEDAG,
        kilde: {
            type: SpleisSykdomsdagkildeType.SØKNAD,
            kildeId: 'en-søknad',
        },
    },
    {
        dagen: '2020-01-04',
        type: SpleisSykdomsdagtype.STUDIEDAG,
        kilde: {
            type: SpleisSykdomsdagkildeType.SØKNAD,
            kildeId: 'en-søknad',
        },
    },
    {
        dagen: '2020-01-05',
        type: SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD,
    },
    {
        dagen: '2020-01-06',
        type: SpleisSykdomsdagtype.ARBEIDSGIVERDAG,
        kilde: {
            type: SpleisSykdomsdagkildeType.INNTEKTSMELDING,
            kildeId: 'en-inntektsmelding',
        },
    },
    {
        dagen: '2020-01-07',
        type: SpleisSykdomsdagtype.FORELDET_SYKEDAG,
        kilde: {
            type: SpleisSykdomsdagkildeType.SYKMELDING,
            kildeId: 'en-sykmelding',
        },
        grad: 100,
    },
    {
        dagen: '2020-01-08',
        type: SpleisSykdomsdagtype.ANNULLERT_DAG,
        kilde: {
            type: SpleisSykdomsdagkildeType.SAKSBEHANDLER,
            kildeId: 'en-saksbehandler',
        },
    },
];

const enMappetSykdomstidlinje = [
    {
        type: Dagtype.Arbeidsdag,
        dato: somDato('2020-01-01'),
        gradering: undefined,
        kilde: Kildetype.Inntektsmelding,
        kildeId: 'en-inntektsmelding',
    },
    {
        type: Dagtype.Syk,
        dato: somDato('2020-01-02'),
        gradering: 100,
        kilde: Kildetype.Søknad,
        kildeId: 'en-søknad',
    },
    {
        type: Dagtype.Ferie,
        dato: somDato('2020-01-03'),
        gradering: undefined,
        kilde: Kildetype.Søknad,
        kildeId: 'en-søknad',
    },
    {
        type: Dagtype.Ubestemt,
        dato: somDato('2020-01-04'),
        gradering: undefined,
        kilde: Kildetype.Søknad,
        kildeId: 'en-søknad',
    },
    {
        type: Dagtype.Helg,
        dato: somDato('2020-01-05'),
        gradering: undefined,
        kilde: Kildetype.Søknad,
        kildeId: undefined,
    },
    {
        type: Dagtype.Egenmelding,
        dato: somDato('2020-01-06'),
        gradering: undefined,
        kilde: Kildetype.Inntektsmelding,
        kildeId: 'en-inntektsmelding',
    },
    {
        type: Dagtype.Foreldet,
        dato: somDato('2020-01-07'),
        gradering: 100,
        kilde: Kildetype.Sykmelding,
        kildeId: 'en-sykmelding',
    },
    {
        type: Dagtype.Annullert,
        dato: somDato('2020-01-08'),
        gradering: undefined,
        kilde: Kildetype.Saksbehandler,
        kildeId: 'en-saksbehandler',
    },
];

test('mapSykdomstidslinje', () => {
    expect(mapSykdomstidslinje(enUmappetSykdomstidlinje)).toEqual(enMappetSykdomstidlinje);
});

describe('mapUtbetalingstidslinje', () => {
    test('mapper navdager', () => {
        const umappet = {
            type: SpleisUtbetalingsdagtype.NAVDAG,
            inntekt: 1234,
            dato: '2020-01-01',
            utbetaling: 1234,
            grad: 100,
            begrunnelse: undefined,
        };
        const mappet = {
            type: Dagtype.Syk,
            utbetaling: 1234,
            dato: dayjs('2020-01-01'),
            gradering: 100,
            avvistÅrsak: undefined,
        };
        expect(mapUtbetalingstidslinje([umappet], {} as SpleisVilkår)).toEqual([mappet]);
    });
    test('mapper avviste dager', () => {
        const umappet = {
            type: SpleisUtbetalingsdagtype.AVVISTDAG,
            inntekt: 1234,
            dato: '2020-01-01',
            utbetaling: 0,
            grad: 100,
            begrunnelse: 'Fordi',
        };
        const mappet = {
            type: Dagtype.Avvist,
            utbetaling: 0,
            dato: dayjs('2020-01-01'),
            gradering: 100,
            avvistÅrsak: {
                tekst: 'Fordi',
                paragraf: undefined,
            },
        };
        const vilkår = { alder: { alderSisteSykedag: 20 } } as SpleisVilkår;
        expect(mapUtbetalingstidslinje([umappet], vilkår)).toEqual([mappet]);
    });
    test('mapper avviste dager med paragraf 8-51', () => {
        const umappet = {
            type: SpleisUtbetalingsdagtype.AVVISTDAG,
            inntekt: 1234,
            dato: '2020-01-01',
            utbetaling: 0,
            grad: 100,
            begrunnelse: 'Fordi',
        };
        const mappet = {
            type: Dagtype.Avvist,
            utbetaling: 0,
            dato: dayjs('2020-01-01'),
            gradering: 100,
            avvistÅrsak: {
                tekst: 'Fordi',
                paragraf: '8-51',
            },
        };
        const vilkår = { alder: { alderSisteSykedag: 67 } } as SpleisVilkår;
        expect(mapUtbetalingstidslinje([umappet], vilkår)).toEqual([mappet]);
    });
});
