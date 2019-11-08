import behov from '../../../__mock-data__/tidslinjeperson';
import personMapper from './mapper';

test('mapper data riktig for inngangsvilkår-siden', () => {
    const expectedPerson = {
        inngangsvilkår: {
            dagerIgjen: {
                dagerBrukt: expect.anything(),
                tidligerePerioder: [],
                førsteFraværsdag: '2019-09-10',
                førsteSykepengedag: '2019-09-26',
                yrkesstatus: expect.anything()
            },
            sykepengegrunnlag: expect.anything(),
            søknadsfrist: {}
        }
    };
    expect(personMapper.map(behov)).toEqual(expect.objectContaining(expectedPerson));
});
