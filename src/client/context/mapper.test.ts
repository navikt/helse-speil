import behov from '../../../__mock-data__/mock-sak-1.json';
import personMapper, { beregnAlder, enesteSak, filtrerPaddedeArbeidsdager } from './mapper';
import { Dagtype, Sak, UnmappedPerson } from './types';

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
            }
        }
    };
    const personinfo = { fødselsdato: '1956-12-12', fnr: '123', kjønn: 'mann', navn: 'Sjaman Durek' };
    expect(personMapper.map(behov, personinfo)).toEqual(expect.objectContaining(expectedPerson));
});

test('filtrerer vekk paddede arbeidsdager', () => {
    const paddedeArbeidsdager = [
        {
            "dato": "2019-09-08",
            "type": "ARBEIDSDAG",
            "erstatter": [],
            "hendelseId": "f8d10337-b0de-4036-ba95-67e5d0f041e4"
        },
        {
            "dato": "2019-09-09",
            "type": "ARBEIDSDAG",
            "erstatter": [],
            "hendelseId": "f8d10337-b0de-4036-ba95-67e5d0f041e4"
        }
    ];

    const personMedPaddedeArbeidsdager: UnmappedPerson = {
        ...behov,
        arbeidsgivere: [
            {
                ...behov.arbeidsgivere[0],
                saker: [
                    {
                        ...behov.arbeidsgivere[0].saker[0],
                        sykdomstidslinje: {
                            hendelser: [],
                            dager: [
                                ...paddedeArbeidsdager,
                                ...behov.arbeidsgivere[0].saker[0].sykdomstidslinje.dager
                            ]
                        }
                    }
                ]
            }
        ]
    };

    const sakUtenPaddedeArbeidsdager: Sak = filtrerPaddedeArbeidsdager(enesteSak(personMedPaddedeArbeidsdager));
    const førsteDag = sakUtenPaddedeArbeidsdager.sykdomstidslinje.dager[0];

    expect(førsteDag.type !== Dagtype.ARBEIDSDAG).toBeTruthy();
});

test('fjerner ingen dager dersom første dag ikke er ARBEIDSDAG', () => {
    const unmappedPerson: UnmappedPerson = {...behov};
    const opprinneligSak: Sak = enesteSak(unmappedPerson);
    const sakUtenPaddedeArbeidsdager: Sak = filtrerPaddedeArbeidsdager(enesteSak(unmappedPerson));

    opprinneligSak.sykdomstidslinje.dager.forEach((dag, i) => {
        const ikkePaddetDag = sakUtenPaddedeArbeidsdager.sykdomstidslinje.dager[i];
        expect(ikkePaddetDag.type).toBe(dag.type);
    });
});

test('beregner alder riktig', () => {
    const søknadstidspunkt1 = '2020-01-14T00:00:00';
    const søknadstidspunkt2 = '2020-01-15T00:00:00';
    const fødselsdato = '2000-01-15';

    expect(beregnAlder(søknadstidspunkt1, fødselsdato)).toBe(19);
    expect(beregnAlder(søknadstidspunkt2, fødselsdato)).toBe(20);
});
