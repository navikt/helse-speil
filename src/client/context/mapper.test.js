import behov from '../../../__mock-data__/tidslinjeperson';
import personMapper, { beregnAlder } from './mapper';

test('mapper data riktig for inngangsvilkår-siden', () => {
    const expectedPerson = {
        inngangsvilkår: {
            alder: 62,
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
        },
        inntektskilder: {
            månedsinntekt: 666.0,
            årsinntekt: 7992.0,
            refusjon: '(Ja)',
            forskuttering: '(Ja)'
        }
    };
    const personinfo = { fødselsdato: '1956-12-12' };
    expect(personMapper.map(behov, personinfo)).toEqual(expect.objectContaining(expectedPerson));
});

test('beregner alder riktig', () => {
    const søknadstidspunkt1 = '2020-01-14T00:00:00';
    const søknadstidspunkt2 = '2020-01-15T00:00:00';
    const fødselsdato = '2000-01-15';

    expect(beregnAlder(søknadstidspunkt1, fødselsdato)).toBe(19);
    expect(beregnAlder(søknadstidspunkt2, fødselsdato)).toBe(20);
});
