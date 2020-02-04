// @ts-nocheck
import behov from '../../../__mock-data__/mock-person_til-godkjenning.json';
import personMapper, { beregnAlder, enesteSak, filtrerPaddedeArbeidsdager } from './mapperNy';
import { Dagtype, Vedtaksperiode, UnmappedPerson } from './types';

test('mapper data riktig for inngangsvilkårssiden', () => {
    const expectedPerson = {
        inngangsvilkår: {
            alder: 61,
            dagerIgjen: {
                dagerBrukt: 15,
                tidligerePerioder: [],
                førsteFraværsdag: '2018-01-01',
                førsteSykepengedag: '2018-01-17',
                maksdato: '2018-12-28'
            },
            sykepengegrunnlag: 12000,
            søknadsfrist: {
                sendtNav: '2018-02-04T11:03:11.432718',
                søknadTom: '2018-01-31',
                innen3Mnd: true
            }
        },
        inntektskilder: {
            månedsinntekt: 1000,
            årsinntekt: 12000,
            refusjon: '(Ja)',
            forskuttering: '(Ja)'
        },
        sykepengegrunnlag: {
            avviksprosent: 0,
            årsinntektFraAording: 12000,
            årsinntektFraInntektsmelding: 12000,
            dagsats: 1000
        },
        oppsummering: {
            sykepengegrunnlag: 12000,
            dagsats: 1000,
            antallDager: 15,
            beløp: 1000 * 15,
            mottakerOrgnr: '987654321',
            vedtaksperiodeId: 'a89647ae-4586-42aa-b87a-9aae048e53c5',
            utbetalingsreferanse: null
        }
    };
    const personinfo = {
        fødselsdato: '1956-12-12',
        fnr: '123',
        kjønn: 'mann',
        navn: 'Sjaman Durek'
    };
    expect(personMapper.map(behov, personinfo)).toEqual(expect.objectContaining(expectedPerson));
});

test('filtrerer vekk paddede arbeidsdager', () => {
    const paddedeArbeidsdager = [
        {
            dato: '2019-09-08',
            type: 'ARBEIDSDAG',
            erstatter: [],
            hendelseId: 'f8d10337-b0de-4036-ba95-67e5d0f041e4'
        },
        {
            dato: '2019-09-09',
            type: 'ARBEIDSDAG',
            erstatter: [],
            hendelseId: 'f8d10337-b0de-4036-ba95-67e5d0f041e4'
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

    const sakUtenPaddedeArbeidsdager: Vedtaksperiode = filtrerPaddedeArbeidsdager(
        enesteSak(personMedPaddedeArbeidsdager)
    );
    const førsteDag = sakUtenPaddedeArbeidsdager.sykdomstidslinje.dager[0];

    expect(førsteDag.type !== Dagtype.ARBEIDSDAG).toBeTruthy();
});

test('fjerner ingen dager dersom første dag ikke er ARBEIDSDAG eller IMPLISITT_DAG', () => {
    const unmappedPerson: UnmappedPerson = { ...behov };
    const opprinneligSak: Vedtaksperiode = enesteSak(unmappedPerson);
    const sakUtenPaddedeArbeidsdager: Vedtaksperiode = filtrerPaddedeArbeidsdager(
        enesteSak(unmappedPerson)
    );

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
