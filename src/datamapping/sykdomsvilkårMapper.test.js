import Mapper from './sykdomsvilkårMapper';

test('mindre enn åtte uker', () => {
    const unmapped = {
        førsteSykdomsdag: '2019-01-01T00:00:00.000Z',
        sisteSykdomsdag: '2019-01-17T00:00:00.000Z'
    };
    const mapped = Mapper.mindreEnnÅtteUker(unmapped);
    expect(mapped).toEqual([
        {
            label: 'Første sykmeldingsdag',
            value: '01.01.2019'
        },
        {
            label: 'Siste sykmeldingsdag',
            value: '17.01.2019'
        }
    ]);
});
