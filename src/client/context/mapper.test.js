import dayjs from 'dayjs';
import behov from '../../../__mock-data__/tidslinjeperson';
import personMapper, { beregnAlder, finnFødselsårFraFødselsnummerår } from './mapper';

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
    const personinfo = { fnr: '12125678900' };
    expect(personMapper.map(behov, personinfo)).toEqual(expect.objectContaining(expectedPerson));
});

test('beregner alder riktig', () => {
    const søknadstidspunkt1 = '2020-01-14T00:00:00';
    const søknadstidspunkt2 = '2020-01-15T00:00:00';
    const fnr = '15010012345';

    expect(beregnAlder(søknadstidspunkt1, fnr)).toBe(19);
    expect(beregnAlder(søknadstidspunkt2, fnr)).toBe(20);
});

test('bruker riktig fødselsår', () => {
    const årstallIDagFireSifre = dayjs().year();
    const årstallToSifre = årstallIDagFireSifre % 100;

    expect(finnFødselsårFraFødselsnummerår('' + (årstallToSifre - 1))).toBe(
        årstallIDagFireSifre - 1
    );
    expect(finnFødselsårFraFødselsnummerår('' + årstallToSifre)).toBe(årstallIDagFireSifre);
    expect(finnFødselsårFraFødselsnummerår('' + (årstallToSifre + 1))).toBe(
        årstallIDagFireSifre + 1 - 100
    );
});
