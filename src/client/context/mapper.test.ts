import behov from '../../../__mock-data__/mock-sak-1.json';
import personMapper, { beregnAlder } from './mapper';

test('mapper data riktig for inngangsvilkårssiden', () => {
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
            sykepengegrunnlag: 7995.96,
            søknadsfrist: {
                sendtNav: '2019-10-15T00:00:00',
                søknadTom: '2019-10-05',
                innen3Mnd: true
            }
        },
        inntektskilder: {
            månedsinntekt: 666.33,
            årsinntekt: 7995.96,
            refusjon: '(Ja)',
            forskuttering: '(Ja)'
        },
        sykepengegrunnlag: {
            månedsinntekt: 666.33,
            årsinntekt: 7995.96,
            grunnlag: 7995.96,
            dagsats: 31
        },
        oppsummering: {
            sykepengegrunnlag: 7995.96,
            dagsats: 31,
            antallDager: 6,
            beløp: 31 * 6,
            mottaker: {
                navn: 'Kongehuset',
                orgnummer: '123456789'
            },
            sakskompleksId: 'aaaaaaaa-6541-4dcf-aa53-8b466fc4ac87'
        }
    };
    const personinfo = { fødselsdato: '1956-12-12', fnr: '123', kjønn: 'mann', navn: 'Sjaman Durek' };
    expect(personMapper.map(behov, personinfo)).toEqual(expect.objectContaining(expectedPerson));
});

test('beregner alder riktig', () => {
    const søknadstidspunkt1 = '2020-01-14T00:00:00';
    const søknadstidspunkt2 = '2020-01-15T00:00:00';
    const fødselsdato = '2000-01-15';

    expect(beregnAlder(søknadstidspunkt1, fødselsdato)).toBe(19);
    expect(beregnAlder(søknadstidspunkt2, fødselsdato)).toBe(20);
});
