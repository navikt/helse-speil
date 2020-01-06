import { _buildDagsatserDictionary, _sumDagsatser } from './Timeline';

const utbetalingslinjer = [
    {
        fom: '2019-09-20',
        tom: '2019-09-27',
        dagsats: 100
    },
    {
        fom: '2019-09-28',
        tom: '2019-10-05',
        dagsats: 200
    }
];

test('buildDagsatserDictionary bygger et objekt som inneholder alle datoer som nøkler', () => {
    const dagsatser = _buildDagsatserDictionary(utbetalingslinjer);
    expect(dagsatser['2019-09-19']).toBeUndefined();
    expect(dagsatser['2019-09-20']).toBe(100);
    expect(dagsatser['2019-09-21']).toBe(100);
    expect(dagsatser['2019-09-22']).toBe(100);
    expect(dagsatser['2019-09-23']).toBe(100);
    expect(dagsatser['2019-09-24']).toBe(100);
    expect(dagsatser['2019-09-25']).toBe(100);
    expect(dagsatser['2019-09-26']).toBe(100);
    expect(dagsatser['2019-09-27']).toBe(100);
    expect(dagsatser['2019-09-28']).toBe(200);
    expect(dagsatser['2019-09-29']).toBe(200);
    expect(dagsatser['2019-09-30']).toBe(200);
    expect(dagsatser['2019-10-01']).toBe(200);
    expect(dagsatser['2019-10-02']).toBe(200);
    expect(dagsatser['2019-10-03']).toBe(200);
    expect(dagsatser['2019-10-04']).toBe(200);
    expect(dagsatser['2019-10-05']).toBe(200);
    expect(dagsatser['2019-10-07']).toBeUndefined();
});

test('sumDagsatser finner riktig sum for dagsatser i en periode', () => {
    const sum = _sumDagsatser(_buildDagsatserDictionary(utbetalingslinjer));
    expect(sum).toBe(2400);
});
