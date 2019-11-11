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
                maksdato: '2020-09-11',
                yrkesstatus: expect.anything()
            },
            sykepengegrunnlag: 7992.0,
            søknadsfrist: {
                sendtNav: '2019-10-15T00:00:00'
            }
        }
    };
    expect(personMapper.map(behov)).toEqual(expect.objectContaining(expectedPerson));
});
