import Mapper from '../../src/datamapping/sykdomsvilkårMapper';

test('mindre enn åtte uker', () => {
    const unmapped = { førsteSykdomsdag: '2019-01-01T00:00:00.000Z' };
    const mapped = Mapper.mindreEnnÅtteUker(unmapped);
    expect(mapped).toEqual([
        {
            label: 'Første sykdomsdag',
            value: '01.01.2019'
        }
    ]);
});
