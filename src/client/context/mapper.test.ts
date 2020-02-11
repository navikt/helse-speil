// @ts-nocheck
import behov from '../../../__mock-data__/mock-person_til-godkjenning.json';
import personMapper, {
    beregnAlder,
    enesteVedtaksperiode,
    filtrerPaddedeArbeidsdager
} from './mapper';
import { Dagtype, Vedtaksperiode, UnmappedPerson } from './types';

test('mapper data riktig for inngangsvilkårssiden', () => {
    const expectedPerson = {
        inngangsvilkår: {
            alder: 61,
            dagerIgjen: {
                dagerBrukt: 11,
                tidligerePerioder: [],
                førsteFraværsdag: '2018-01-01',
                førsteSykepengedag: '2018-01-17',
                maksdato: '2018-12-28'
            },
            opptjening: {
                antallOpptjeningsdagerErMinst: 365,
                harOpptjening: true,
                opptjeningFra: '01.01.2017'
            },
            sykepengegrunnlag: 372000,
            søknadsfrist: {
                sendtNav: '2018-02-04T11:03:11.432718',
                søknadTom: '2018-01-31',
                innen3Mnd: true
            }
        },
        inntektskilder: {
            månedsinntekt: 31000.0,
            årsinntekt: 372000.0,
            refusjon: 'Ja',
            forskuttering: 'Ja'
        },
        sykepengegrunnlag: {
            avviksprosent: 0,
            årsinntektFraAording: 372000,
            årsinntektFraInntektsmelding: 372000,
            dagsats: 1431
        },
        oppsummering: {
            sykepengegrunnlag: 372000,
            dagsats: 1431,
            antallDager: 11,
            beløp: 1431 * 11,
            mottakerOrgnr: '987654321',
            vedtaksperiodeId: '8dee480f-806e-4942-8f0a-15d76261d772',
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
                vedtaksperioder: [
                    {
                        ...behov.arbeidsgivere[0].vedtaksperioder[0],
                        sykdomstidslinje: [
                            ...paddedeArbeidsdager,
                            ...behov.arbeidsgivere[0].vedtaksperioder[0].sykdomstidslinje
                        ]
                    }
                ]
            }
        ]
    };

    expect(enesteVedtaksperiode(personMedPaddedeArbeidsdager).sykdomstidslinje).toEqual(
        expect.objectContaining(paddedeArbeidsdager)
    );

    const sakUtenPaddedeArbeidsdager: Vedtaksperiode = filtrerPaddedeArbeidsdager(
        enesteVedtaksperiode(personMedPaddedeArbeidsdager)
    );

    const førsteDag = sakUtenPaddedeArbeidsdager.sykdomstidslinje[0];
    expect(førsteDag.type !== Dagtype.ARBEIDSDAG).toBeTruthy();
});

test('Opptjening er undefined dersom felter er satt til null', () => {
    const personUtenOpptjeningsinfo: UnmappedPerson = {
        ...behov,
        arbeidsgivere: [
            {
                ...behov.arbeidsgivere[0],
                vedtaksperioder: [
                    {
                        ...behov.arbeidsgivere[0].vedtaksperioder[0],
                        dataForVilkårsvurdering: {
                            ...behov.arbeidsgivere[0].vedtaksperioder[0].dataForVilkårsvurdering,
                            antallOpptjeningsdagerErMinst: null,
                            harOpptjening: null
                        }
                    }
                ]
            }
        ]
    };

    const personinfo = {
        fødselsdato: '1956-12-12',
        fnr: '123',
        kjønn: 'mann',
        navn: 'Sjaman Durek'
    };
    expect(
        personMapper.map(personUtenOpptjeningsinfo, personinfo).inngangsvilkår.opptjening
    ).toBeUndefined();
    expect(personMapper.map(behov, personinfo).inngangsvilkår.opptjening).toBeDefined();
});

test('fjerner ingen dager dersom første dag ikke er ARBEIDSDAG eller IMPLISITT_DAG', () => {
    const unmappedPerson: UnmappedPerson = { ...behov };
    const opprinneligSak: Vedtaksperiode = enesteVedtaksperiode(unmappedPerson);
    const sakUtenPaddedeArbeidsdager: Vedtaksperiode = filtrerPaddedeArbeidsdager(
        enesteVedtaksperiode(unmappedPerson)
    );

    opprinneligSak.sykdomstidslinje.forEach((dag, i) => {
        const ikkePaddetDag = sakUtenPaddedeArbeidsdager.sykdomstidslinje[i];
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
