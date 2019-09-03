import Mapper from './inngangsvilkårMapper';
import '@testing-library/jest-dom/extend-expect';

test('medlemskap', () => {
    const unmapped = {
        bosattINorge: true,
        diskresjonskode: null,
        statsborgerskap: 'NOR'
    };
    const mapped = Mapper.medlemskap(unmapped);
    expect(mapped).toEqual([
        { label: 'Statsborgerskap', value: 'Norsk' },
        { label: 'Bosatt i Norge', value: 'Ja' },
        { label: 'Diskresjonskode', value: 'Ingen' }
    ]);
});

test('opptjening', () => {
    const unmapped = {
        førsteSykdomsdag: '2019-05-09T00:00:00.000Z',
        antallDager: 768,
        startdato: '2017-04-01T00:00:00.000Z'
    };

    expect(Mapper.opptjening(unmapped)).toEqual([
        { label: 'Første sykdomsdag', value: '09.05.2019' },
        { label: 'Startdato', value: '01.04.2017' },
        { label: 'Sluttdato', value: '-' },
        { label: 'Antall dager (>28)', value: '768' }
    ]);

    unmapped.sluttdato = '2017-05-01T00:00:00.000Z';
    expect(Mapper.opptjening(unmapped)).toEqual([
        { label: 'Første sykdomsdag', value: '09.05.2019' },
        { label: 'Startdato', value: '01.04.2017' },
        { label: 'Sluttdato', value: '01.05.2017' },
        { label: 'Antall dager (>28)', value: '768' }
    ]);
});

test('søknadsfrist', () => {
    const unmapped = {
        sendtNav: '2019-06-11T15:21:29.127Z',
        sisteSykdomsdag: '2019-05-26T00:00:00.000Z',
        innen3Mnd: true
    };
    expect(Mapper.søknadsfrist(unmapped)).toEqual([
        { label: 'Sendt NAV', value: '11.06.2019' },
        { label: 'Siste sykdomsdag', value: '26.05.2019' },
        { label: 'Innen 3 mnd', value: 'Ja' }
    ]);
});

test('dagerIgjen', () => {
    const unmapped = {
        førsteFraværsdag: '2019-05-09T00:00:00.000Z',
        førsteSykepengedag: '2019-05-09T00:00:00.000Z',
        yrkesstatus: 'ARBEIDSTAKER',
        dagerBrukt: {
            antallDagerBrukt: 0,
            antallDagerIgjen: 248
        },
        tidligerePerioder: [],
        maxDato: '2020-04-20T00:00:00.000Z'
    };
    expect(Mapper.dagerIgjen(unmapped)).toEqual([
        { label: 'Første fraværsdag', value: '09.05.2019' },
        { label: 'Første sykepengedag', value: '09.05.2019' },
        { label: 'Yrkesstatus', value: 'Arbeidstaker' },
        { label: 'Dager brukt', value: 0 },
        { label: 'Dager igjen', value: 248 },
        { label: 'Max dato', value: '20.04.2020' }
    ]);
});
