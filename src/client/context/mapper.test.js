import dayjs from 'dayjs';
import behov from '../../../__mock-data__/tidslinjeperson';
import personMapper, { beregnAlder, finnFødselsår } from './mapper';

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
    const personinfo = { fnr: '12125612300' };
    expect(personMapper.map(behov, personinfo)).toEqual(expect.objectContaining(expectedPerson));
});

test('beregner alder riktig', () => {
    const søknadstidspunkt1 = '2020-01-14T00:00:00';
    const søknadstidspunkt2 = '2020-01-15T00:00:00';
    const fnr = '15010072345';

    expect(beregnAlder(søknadstidspunkt1, fnr)).toBe(19);
    expect(beregnAlder(søknadstidspunkt2, fnr)).toBe(20);
});

test('bruker riktig fødselsår', () => {
    expect(finnFødselsår('01017010000')).toBe('1970');
    expect(finnFødselsår('01011010000')).toBe('1910');

    expect(finnFødselsår('01010050000')).toBe('2000');
    expect(finnFødselsår('01016074900')).toBe('1860');

    expect(finnFødselsår('01010050000')).toBe('2000');
    expect(finnFødselsår('01013999900')).toBe('2039');

    expect(finnFødselsår('01014090000')).toBe('1940');
    expect(finnFødselsår('01019999900')).toBe('1999');
});
