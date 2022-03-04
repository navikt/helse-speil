import dayjs from 'dayjs';

import { mapPerson } from '../../mapping/person';

import { umappetArbeidsgiver } from './arbeidsgiver';
import { umappetInntektsgrunnlag } from './inntektsgrunnlag';
import { etSpleisgrunnlag } from './vilkårsgrunnlaghistorikk';

export const testAktørId: string = '1211109876233';
export const testFødselsnummer: string = '01019000123';
export const testOrganisasjonsnummer: string = '987654321';
export const testBeregningId: string = '817e21da-1284-49e0-ab2a-8191a672c90a';
export const testBeregningId2: string = '928e21da-1284-49e0-ab2a-8191a672c81b';
export const testArbeidsgiverfagsystemId: string = 'ENFAGSYSTEMID';
export const testPersonfagsystemId: string = 'ENPERSONFAGSYSTEMID';
export const testVedtaksperiodeId: string = 'fa02d7a5-daf2-488c-9798-2539edd7fe3f';
export const testVilkårsgrunnlagHistorikkId: UUID = '33612787-ca6c-45ba-bbd0-29ae6474d9c2';
export const testSkjæringstidspunkt: DateString = '2018-01-01';
export const testEnkelPeriodeFom: DateString = '2018-01-01';
export const testEnkelPeriodeTom: DateString = '2018-01-31';

export const umappetPerson = (
    arbeidsgivere = [umappetArbeidsgiver()],
    utbetalinger = [],
    inntektsgrunnlag = [umappetInntektsgrunnlag()]
): ExternalPerson => ({
    aktørId: testAktørId,
    fødselsnummer: testFødselsnummer,
    personinfo: {
        fornavn: 'Kringle',
        mellomnavn: null,
        etternavn: 'Krangel',
        fødselsdato: '1956-12-12T00:00:00.000Z',
        kjønn: 'Mannebjørn',
        adressebeskyttelse: 'Ugradert',
    },
    dødsdato: null,
    infotrygdutbetalinger: [],
    utbetalinger: utbetalinger,
    arbeidsgivere,
    enhet: { id: '', navn: '' },
    arbeidsforhold: [
        {
            organisasjonsnummer: testOrganisasjonsnummer,
            stillingstittel: 'Potetplukker',
            stillingsprosent: 100,
            startdato: '2018-01-01',
        },
    ],
    inntektsgrunnlag,
    vilkårsgrunnlagHistorikk: {
        [testVilkårsgrunnlagHistorikkId]: {
            [testSkjæringstidspunkt]: etSpleisgrunnlag(),
        },
    },
    tildeling: null,
});

export const mappetPerson = (
    arbeidsgivere = [umappetArbeidsgiver()],
    utbetalinger = [],
    inntektsgrunnlag = [umappetInntektsgrunnlag()]
) => mapPerson(umappetPerson(arbeidsgivere, [], inntektsgrunnlag)).person;

export const mappetPersonObject = (): Person => ({
    enhet: {
        id: '',
        navn: '',
    },
    aktørId: '1211109876233',
    fødselsnummer: '01019000123',
    personinfo: {
        fornavn: 'Kringle',
        mellomnavn: null,
        etternavn: 'Krangel',
        fødselsdato: dayjs('1956-12-12T00:00:00.000Z'),
        kjønn: 'Mannebjørn' as Personinfo['kjønn'],
        fnr: '01019000123',
        adressebeskyttelse: 'Ugradert',
    },
    utbetalinger: [],
    arbeidsgivere: [
        {
            navn: 'Potetsekk AS',
            id: '3fb100f2-5d3d-4a89-84cd-e123544a4400',
            organisasjonsnummer: testOrganisasjonsnummer,
            vedtaksperioder: [
                {
                    id: testVedtaksperiodeId,
                    gruppeId: 'en-gruppeId',
                    arbeidsgivernavn: 'Potetsekk AS',
                    oppgavereferanse: 'en-oppgavereferanse',
                    utbetalingsreferanse: 'en-utbetalingsreferanse',
                    fullstendig: true,
                    erForkastet: false,
                    erNyeste: true,
                    vilkår: {
                        alder: {
                            alderSisteSykedag: 28,
                            oppfylt: true,
                        },
                        dagerIgjen: {
                            dagerBrukt: 3,
                            skjæringstidspunkt: dayjs('2018-01-01T00:00:00.000Z'),
                            førsteSykepengedag: dayjs('2018-01-01T00:00:00.000Z'),
                            maksdato: dayjs('2018-10-08T00:00:00.000Z'),
                            oppfylt: true,
                            tidligerePerioder: [],
                            gjenståendeDager: undefined,
                        },
                        opptjening: {
                            antallOpptjeningsdagerErMinst: 3539,
                            oppfylt: true,
                            opptjeningFra: dayjs('2008-04-24T00:00:00.000Z'),
                        },
                        søknadsfrist: {
                            sendtNav: dayjs('2018-02-01T00:00:00.000Z'),
                            søknadFom: dayjs('2018-01-01T00:00:00.000Z'),
                            oppfylt: true,
                        },
                        sykepengegrunnlag: {
                            sykepengegrunnlag: 372000,
                            oppfylt: true,
                            grunnebeløp: 99858,
                        },
                        medlemskap: { oppfylt: true },
                    },
                    tilstand: 'oppgaver',
                    behandlet: false,
                    forlengelseFraInfotrygd: false,
                    hendelser: [
                        {
                            id: 'c554ee9b-30ca-4c7f-adce-c0224108e83a',
                            type: 'Sykmelding',
                            fom: dayjs('2018-01-01T00:00:00.000Z'),
                            tom: dayjs('2018-01-31T00:00:00.000Z'),
                            rapportertDato: dayjs('2018-02-15T00:00:00.000Z'),
                        },
                        {
                            id: '726e57d9-7844-4a28-886b-8485dbdbd4d2',
                            type: 'Søknad',
                            fom: dayjs('2018-01-01T00:00:00.000Z'),
                            tom: dayjs('2018-01-31T00:00:00.000Z'),
                            sendtNav: dayjs('2018-02-15T00:00:00.000Z'),
                            rapportertDato: dayjs('2018-02-15T00:00:00.000Z'),
                        },
                        {
                            id: '09851096-bcba-4c7a-8dc0-a1617a744f1f',
                            type: 'Inntektsmelding',
                            beregnetInntekt: 31000,
                            mottattTidspunkt: dayjs('2018-01-16T00:00:00.000Z'),
                        },
                    ],
                    fom: dayjs('2018-01-01T00:00:00.000Z'),
                    tom: dayjs('2018-01-31T00:00:00.000Z'),
                    utbetalingstidslinje: [
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-01T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-02T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-03T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-04T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-05T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Helg',
                            dato: dayjs('2018-01-06T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: 'Helg',
                            dato: dayjs('2018-01-07T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-08T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-09T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-10T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-11T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-12T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Helg',
                            dato: dayjs('2018-01-13T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: 'Helg',
                            dato: dayjs('2018-01-14T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-15T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-16T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-17T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-18T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-19T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Helg',
                            dato: dayjs('2018-01-20T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: 'Helg',
                            dato: dayjs('2018-01-21T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-22T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-23T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-24T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-25T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-26T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Helg',
                            dato: dayjs('2018-01-27T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: 'Helg',
                            dato: dayjs('2018-01-28T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-29T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-30T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: 'Syk',
                            dato: dayjs('2018-01-31T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                    ],
                    sykdomstidslinje: [
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-01T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-02T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-03T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-04T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-05T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Helg',
                            dato: dayjs('2018-01-06T00:00:00.000Z'),
                            kilde: 'Søknad',
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: 'Helg',
                            dato: dayjs('2018-01-07T00:00:00.000Z'),
                            kilde: 'Søknad',
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-08T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-09T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-10T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-11T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-12T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Helg',
                            dato: dayjs('2018-01-13T00:00:00.000Z'),
                            kilde: 'Søknad',
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: 'Helg',
                            dato: dayjs('2018-01-14T00:00:00.000Z'),
                            kilde: 'Søknad',
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-15T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-16T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-17T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-18T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-19T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Helg',
                            dato: dayjs('2018-01-20T00:00:00.000Z'),
                            kilde: 'Søknad',
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: 'Helg',
                            dato: dayjs('2018-01-21T00:00:00.000Z'),
                            kilde: 'Søknad',
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-22T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-23T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-24T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-25T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-26T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Helg',
                            dato: dayjs('2018-01-27T00:00:00.000Z'),
                            kilde: 'Søknad',
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: 'Helg',
                            dato: dayjs('2018-01-28T00:00:00.000Z'),
                            kilde: 'Søknad',
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-29T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-30T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: 'Syk',
                            dato: dayjs('2018-01-31T00:00:00.000Z'),
                            kilde: 'Sykmelding',
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                    ],
                    periodetype: 'førstegangsbehandling',
                    utbetalinger: {
                        arbeidsgiverUtbetaling: {
                            fagsystemId: testArbeidsgiverfagsystemId,
                            linjer: [
                                {
                                    fom: dayjs('2018-01-01T00:00:00.000Z'),
                                    tom: dayjs('2018-01-31T00:00:00.000Z'),
                                    dagsats: 1500,
                                    grad: 100,
                                },
                            ],
                        },
                        personUtbetaling: undefined,
                    },
                    utbetaling: {
                        korrelasjonsId: 'korrelasjonsId',
                        utbetalingId: 'utbetalingId',
                        beregningId: 'beregningId',
                        utbetalingstidslinje: [],
                        type: 'type',
                        maksdato: dayjs('1990-09-29'),
                        status: 'status',
                        gjenståendeSykedager: 1,
                        forbrukteSykedager: 1,
                        arbeidsgiverNettoBeløp: 1,
                        personNettoBeløp: 1,
                        personOppdrag: {
                            fagsystemId: 'personOppdrag',
                            utbetalingslinjer: [],
                        },
                        arbeidsgiverOppdrag: {
                            fagsystemId: 'arbeidsgiverOppdrag',
                            utbetalingslinjer: [],
                            simuleringsResultat: {
                                totalbeløp: 9999,
                                perioder: [
                                    {
                                        fom: '2018-01-01',
                                        tom: '2018-01-02',
                                        utbetalinger: [
                                            {
                                                utbetalesTilId: testOrganisasjonsnummer,
                                                utbetalesTilNavn: 'Koronavirus',
                                                forfall: '2018-01-03',
                                                feilkonto: true,
                                                detaljer: [
                                                    {
                                                        faktiskFom: '2018-01-01',
                                                        faktiskTom: '2018-01-02',
                                                        konto: '12345678910og1112',
                                                        belop: 9999,
                                                        tilbakeforing: false,
                                                        sats: 1111,
                                                        typeSats: 'DAGLIG',
                                                        antallSats: 9,
                                                        uforegrad: 100,
                                                        klassekode: 'SPREFAG-IOP',
                                                        klassekodeBeskrivelse: 'Sykepenger, Refusjon arbeidsgiver',
                                                        utbetalingsType: 'YTELSE',
                                                        refunderesOrgNr: testOrganisasjonsnummer,
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    oppsummering: {
                        antallUtbetalingsdager: 23,
                        totaltTilUtbetaling: 34500,
                    },
                    inntektsgrunnlag: {
                        organisasjonsnummer: testOrganisasjonsnummer,
                        skjæringstidspunkt: dayjs(testSkjæringstidspunkt),
                        sykepengegrunnlag: 372000,
                        omregnetÅrsinntekt: 372000,
                        sammenligningsgrunnlag: 372000,
                        avviksprosent: 0.0,
                        maksUtbetalingPerDag: 1430.7692307692,
                        inntekter: [
                            {
                                arbeidsgivernavn: 'Potetsekk AS',
                                organisasjonsnummer: testOrganisasjonsnummer,
                                omregnetÅrsinntekt: {
                                    kilde: 'Inntektsmelding',
                                    beløp: 372000,
                                    månedsbeløp: 31000.0,
                                    inntekterFraAOrdningen: undefined,
                                },
                                sammenligningsgrunnlag: {
                                    beløp: 372000,
                                    inntekterFraAOrdningen: [
                                        { måned: '2017-12', sum: 31000.0 },
                                        { måned: '2017-11', sum: 31000.0 },
                                        { måned: '2017-10', sum: 31000.0 },
                                        { måned: '2017-09', sum: 31000.0 },
                                        { måned: '2017-08', sum: 31000.0 },
                                        { måned: '2017-07', sum: 31000.0 },
                                        { måned: '2017-06', sum: 31000.0 },
                                        { måned: '2017-05', sum: 31000.0 },
                                        { måned: '2017-04', sum: 31000.0 },
                                        { måned: '2017-03', sum: 31000.0 },
                                        { måned: '2017-02', sum: 31000.0 },
                                        { måned: '2017-01', sum: 31000.0 },
                                    ],
                                },
                                bransjer: ['Sofasitting', 'TV-titting'],
                                forskuttering: true,
                                refusjon: true,
                                arbeidsforhold: [
                                    {
                                        stillingstittel: 'Potetplukker',
                                        stillingsprosent: 100,
                                        startdato: dayjs('2018-01-01T00:00:00.000Z'),
                                    },
                                ],
                            },
                        ],
                    },
                    overstyringer: [],
                    aktivitetslog: ['Aktivitetsloggvarsel'],
                    risikovurdering: { funn: [], kontrollertOk: [] },
                    automatiskBehandlet: false,
                    beregningIder: [testBeregningId],
                    inntektskilde: 'EN_ARBEIDSGIVER',
                },
            ],
            utbetalingshistorikk: [
                {
                    id: testBeregningId,
                    vilkårsgrunnlaghistorikkId: testVilkårsgrunnlagHistorikkId,
                    kilde: 'UTBETALING',
                    beregnettidslinje: [
                        {
                            dato: dayjs('2018-01-01'),
                            type: 'Syk',
                            kildeId: 'eed4d4f5-b629-4986-82db-391336f861e9',
                            kilde: 'Saksbehandler',
                            gradering: 100,
                        },
                    ],
                    hendelsetidslinje: [
                        {
                            dato: dayjs('2018-01-01'),
                            type: 'Syk',
                            kildeId: 'eed4d4f5-b629-4986-82db-391336f861e9',
                            kilde: 'Saksbehandler',
                            gradering: 100,
                        },
                    ],
                    tidsstempel: dayjs('2018-01-01T:00:00:00'),
                    utbetaling: {
                        status: 'UTBETALT',
                        type: 'UTBETALING',
                        utbetalingstidslinje: [
                            {
                                dato: dayjs('2018-01-01'),
                                type: 'Syk',
                            },
                        ],
                        maksdato: dayjs('2018-03-01'),
                        arbeidsgiverNettobeløp: 0,
                        personNettobeløp: 0,
                        forbrukteDager: 0,
                        gjenståendeDager: 0,
                        arbeidsgiverFagsystemId: testArbeidsgiverfagsystemId,
                        personFagsystemId: testPersonfagsystemId,
                        vurdering: {
                            godkjent: true,
                            ident: 'EN_IDENT',
                            tidsstempel: dayjs('2018-01-01'),
                            automatisk: true,
                        },
                    },
                },
            ],
            tidslinjeperioder: [
                [
                    {
                        id: testVedtaksperiodeId,
                        oppgavereferanse: 'en-oppgavereferanse',
                        beregningId: testBeregningId,
                        unique: 'nanoid',
                        fom: dayjs(testEnkelPeriodeFom),
                        tom: dayjs(testEnkelPeriodeTom),
                        type: 'VEDTAKSPERIODE',
                        inntektskilde: 'EN_ARBEIDSGIVER',
                        tilstand: 'utbetaltAutomatisk',
                        fagsystemId: testArbeidsgiverfagsystemId,
                        opprettet: dayjs('2018-01-01T:00:00:00'),
                        utbetalingstidslinje: [
                            {
                                dato: dayjs('2018-01-01'),
                                type: 'Syk',
                            },
                        ],
                        sykdomstidslinje: [
                            {
                                dato: dayjs('2018-01-01'),
                                type: 'Syk',
                                kildeId: 'eed4d4f5-b629-4986-82db-391336f861e9',
                                kilde: 'Saksbehandler',
                                gradering: 100,
                            },
                        ],
                        organisasjonsnummer: testOrganisasjonsnummer,
                        periodetype: 'førstegangsbehandling',
                        fullstendig: true,
                        skjæringstidspunkt: testSkjæringstidspunkt,
                        vilkårsgrunnlaghistorikkId: testVilkårsgrunnlagHistorikkId,
                    },
                ],
            ],
            tidslinjeperioderUtenSykefravær: [],
            arbeidsforhold: [
                {
                    stillingstittel: 'Potetplukker',
                    stillingsprosent: 100,
                    startdato: dayjs('2018-01-01'),
                },
            ],
            generasjoner: [],
        },
    ],
    infotrygdutbetalinger: [],
    tildeling: undefined,
});
