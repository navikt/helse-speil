import dayjs from 'dayjs';
import {
    Dagtype,
    Inntektskilde,
    Inntektskildetype,
    Kildetype,
    Kjønn,
    Periodetype,
    Person,
    Utbetalingstype,
    Vedtaksperiodetilstand,
} from 'internal-types';

import { mapPerson } from '../../client/mapping/person';
import {
    Periodetype as UtbetalingshistorikkPeriodetype,
    Utbetalingstatus,
} from '../../client/modell/UtbetalingshistorikkElement';

import { umappetUtbetalinger } from './SpesialistUtbetaling';
import { umappetArbeidsgiver } from './arbeidsgiver';
import { umappetInntektsgrunnlag } from './inntektsgrunnlag';
import { umappetSimuleringsdata } from './simulering';

export const umappetPerson = (
    arbeidsgivere = [umappetArbeidsgiver()],
    utbetalinger = umappetUtbetalinger(),
    inntektsgrunnlag = [umappetInntektsgrunnlag()]
) => ({
    aktørId: '1211109876233',
    fødselsnummer: '01019000123',
    personinfo: {
        fornavn: 'Kringle',
        mellomnavn: null,
        etternavn: 'Krangel',
        fødselsdato: '1956-12-12T00:00:00.000Z',
        kjønn: 'Mannebjørn',
    },
    utbetalinger,
    arbeidsgivere,
    enhet: { id: '', navn: '' },
    tildeltTil: null,
    erPåVent: null,
    arbeidsforhold: [
        {
            organisasjonsnummer: '987654321',
            stillingstittel: 'Potetplukker',
            stillingsprosent: 100,
            startdato: '2020-01-01',
        },
    ],
    simuleringsdata: umappetSimuleringsdata,
    inntektsgrunnlag,
});

export const mappetPerson = (
    arbeidsgivere = [umappetArbeidsgiver()],
    utbetalinger = umappetUtbetalinger(),
    inntektsgrunnlag = [umappetInntektsgrunnlag()]
) => mapPerson(umappetPerson(arbeidsgivere, utbetalinger, inntektsgrunnlag)).person;

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
        kjønn: 'Mannebjørn' as Kjønn,
        fnr: '01019000123',
    },
    utbetalinger: [
        {
            status: 'UTBETALT',
            type: 'UTBETALING',
            arbeidsgiverOppdrag: {
                orgnummer: '987654321',
                fagsystemId: '6CFURRBEWJF3VGP5Q4BUTO6ABM',
                utbetalingslinjer: [
                    {
                        fom: dayjs('2020-01-17'),
                        tom: dayjs('2020-01-20'),
                    },
                ],
            },
            totalbeløp: null,
        },
        {
            status: 'SENDT',
            type: 'UTBETALING',
            arbeidsgiverOppdrag: {
                orgnummer: '987654321',
                fagsystemId: '6CFURRBEWJF3VGP5Q4BUTO6ABM',
                utbetalingslinjer: [
                    {
                        fom: dayjs('2020-01-17'),
                        tom: dayjs('2020-01-25'),
                    },
                ],
            },
            totalbeløp: null,
        },
    ],
    arbeidsgivere: [
        {
            navn: 'Potetsekk AS',
            id: '3fb100f2-5d3d-4a89-84cd-e123544a4400',
            organisasjonsnummer: '987654321',
            vedtaksperioder: [
                {
                    id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
                    gruppeId: 'en-gruppeId',
                    arbeidsgivernavn: 'Potetsekk AS',
                    oppgavereferanse: 'en-oppgavereferanse',
                    utbetalingsreferanse: 'en-utbetalingsreferanse',
                    fullstendig: true,
                    erNyeste: true,
                    vilkår: {
                        alder: {
                            alderSisteSykedag: 28,
                            oppfylt: true,
                        },
                        dagerIgjen: {
                            dagerBrukt: 3,
                            skjæringstidspunkt: dayjs('2020-01-01T00:00:00.000Z'),
                            førsteSykepengedag: dayjs('2020-01-01T00:00:00.000Z'),
                            maksdato: dayjs('2020-10-07T00:00:00.000Z'),
                            oppfylt: true,
                            tidligerePerioder: [],
                            gjenståendeDager: undefined,
                        },
                        opptjening: {
                            antallOpptjeningsdagerErMinst: 3539,
                            oppfylt: true,
                            opptjeningFra: dayjs('2010-04-24T00:00:00.000Z'),
                        },
                        søknadsfrist: {
                            sendtNav: dayjs('2020-02-01T00:00:00.000Z'),
                            søknadFom: dayjs('2020-01-01T00:00:00.000Z'),
                            oppfylt: true,
                        },
                        sykepengegrunnlag: {
                            sykepengegrunnlag: 372000,
                            oppfylt: true,
                            grunnebeløp: 99858,
                        },
                        medlemskap: { oppfylt: true },
                    },
                    tilstand: Vedtaksperiodetilstand.Oppgaver,
                    behandlet: false,
                    forlengelseFraInfotrygd: false,
                    hendelser: [
                        {
                            id: 'c554ee9b-30ca-4c7f-adce-c0224108e83a',
                            type: Kildetype.Sykmelding,
                            fom: dayjs('2020-01-01T00:00:00.000Z'),
                            tom: dayjs('2020-01-31T00:00:00.000Z'),
                            rapportertDato: dayjs('2020-02-15T00:00:00.000Z'),
                        },
                        {
                            id: '726e57d9-7844-4a28-886b-8485dbdbd4d2',
                            type: Kildetype.Søknad,
                            fom: dayjs('2020-01-01T00:00:00.000Z'),
                            tom: dayjs('2020-01-31T00:00:00.000Z'),
                            sendtNav: dayjs('2020-02-15T00:00:00.000Z'),
                            rapportertDato: dayjs('2020-02-15T00:00:00.000Z'),
                        },
                        {
                            id: '09851096-bcba-4c7a-8dc0-a1617a744f1f',
                            type: Kildetype.Inntektsmelding,
                            beregnetInntekt: 31000,
                            mottattTidspunkt: dayjs('2020-01-16T00:00:00.000Z'),
                        },
                    ],
                    fom: dayjs('2020-01-01T00:00:00.000Z'),
                    tom: dayjs('2020-01-31T00:00:00.000Z'),
                    utbetalingstidslinje: [
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-01T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-02T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-03T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-04T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-05T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-06T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-07T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-08T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-09T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-10T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-11T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-12T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-13T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-14T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-15T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-16T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-17T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-18T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-19T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-20T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-21T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-22T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-23T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-24T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-25T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-26T00:00:00.000Z'),
                            utbetaling: undefined,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-27T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-28T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-29T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-30T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                        {
                            gradering: 100,
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-31T00:00:00.000Z'),
                            utbetaling: 1500,
                        },
                    ],
                    sykdomstidslinje: [
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-01T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-02T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-03T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-04T00:00:00.000Z'),
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-05T00:00:00.000Z'),
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-06T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-07T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-08T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-09T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-10T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-11T00:00:00.000Z'),
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-12T00:00:00.000Z'),
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-13T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-14T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-15T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-16T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-17T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-18T00:00:00.000Z'),
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-19T00:00:00.000Z'),
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-20T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-21T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-22T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-23T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-24T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-25T00:00:00.000Z'),
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Helg,
                            dato: dayjs('2020-01-26T00:00:00.000Z'),
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-27T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-28T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-29T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-30T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: dayjs('2020-01-31T00:00:00.000Z'),
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: 100,
                        },
                    ],
                    periodetype: Periodetype.Førstegangsbehandling,
                    utbetalinger: {
                        arbeidsgiverUtbetaling: {
                            fagsystemId: 'en-fagsystem-id',
                            linjer: [
                                {
                                    fom: dayjs('2020-01-01T00:00:00.000Z'),
                                    tom: dayjs('2020-01-31T00:00:00.000Z'),
                                    dagsats: 1500,
                                    grad: 100,
                                },
                            ],
                        },
                        personUtbetaling: undefined,
                    },
                    oppsummering: {
                        antallUtbetalingsdager: 23,
                        totaltTilUtbetaling: 34500,
                    },
                    inntektsgrunnlag: {
                        organisasjonsnummer: '987654321',
                        skjæringstidspunkt: dayjs('2020-01-01T00:00:00.000Z'),
                        sykepengegrunnlag: 372000,
                        omregnetÅrsinntekt: 372000,
                        sammenligningsgrunnlag: 372000,
                        avviksprosent: 0.0,
                        maksUtbetalingPerDag: 1430.7692307692,
                        inntekter: [
                            {
                                arbeidsgivernavn: 'Potetsekk AS',
                                organisasjonsnummer: '987654321',
                                omregnetÅrsinntekt: {
                                    kilde: Inntektskildetype.Inntektsmelding,
                                    beløp: 372000,
                                    månedsbeløp: 31000.0,
                                    inntekterFraAOrdningen: undefined,
                                },
                                sammenligningsgrunnlag: {
                                    beløp: 372000,
                                    inntekterFraAOrdningen: [
                                        { måned: '2019-01', sum: 31000.0 },
                                        { måned: '2019-02', sum: 31000.0 },
                                        { måned: '2019-03', sum: 31000.0 },
                                        { måned: '2019-04', sum: 31000.0 },
                                        { måned: '2019-05', sum: 31000.0 },
                                        { måned: '2019-06', sum: 31000.0 },
                                        { måned: '2019-07', sum: 31000.0 },
                                        { måned: '2019-08', sum: 31000.0 },
                                        { måned: '2019-09', sum: 31000.0 },
                                        { måned: '2019-10', sum: 31000.0 },
                                        { måned: '2019-11', sum: 31000.0 },
                                        { måned: '2019-12', sum: 31000.0 },
                                    ],
                                },
                                bransjer: ['Sofasitting', 'TV-titting'],
                                forskuttering: true,
                                refusjon: true,
                                arbeidsforhold: [
                                    {
                                        stillingstittel: 'Potetplukker',
                                        stillingsprosent: 100,
                                        startdato: dayjs('2020-01-01T00:00:00.000Z'),
                                    },
                                ],
                            },
                        ],
                    },
                    overstyringer: [],
                    aktivitetslog: ['Aktivitetsloggvarsel'],
                    risikovurdering: { funn: [], kontrollertOk: [] },
                    simuleringsdata: {
                        totalbeløp: 9999,
                        perioder: [
                            {
                                fom: '2020-01-01',
                                tom: '2020-01-02',
                                utbetalinger: [
                                    {
                                        utbetalesTilId: '987654321',
                                        utbetalesTilNavn: 'Koronavirus',
                                        forfall: '2020-01-03',
                                        feilkonto: true,
                                        detaljer: [
                                            {
                                                faktiskFom: '2020-01-01',
                                                faktiskTom: '2020-01-02',
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
                                                refunderesOrgNr: '987654321',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    automatiskBehandlet: false,
                    beregningIder: ['id1'],
                    inntektskilde: Inntektskilde.EnArbeidsgiver,
                },
            ],
            utbetalingshistorikk: [
                {
                    id: 'id1',
                    kilde: Utbetalingstype.UTBETALING,
                    beregnettidslinje: [
                        {
                            dato: dayjs('2020-01-01'),
                            type: Dagtype.Syk,
                        },
                    ],
                    hendelsetidslinje: [
                        {
                            dato: dayjs('2020-01-01'),
                            type: Dagtype.Syk,
                        },
                    ],
                    utbetaling: {
                        status: Utbetalingstatus.IKKE_UTBETALT,
                        type: Utbetalingstype.UTBETALING,
                        utbetalingstidslinje: [
                            {
                                dato: dayjs('2020-01-01'),
                                type: Dagtype.Syk,
                            },
                        ],
                        maksdato: dayjs('2020-03-01'),
                        nettobeløp: 0,
                        forbrukteDager: 0,
                        gjenståendeDager: 0,
                        arbeidsgiverFagsystemId: 'EN_FAGSYSTEMID',
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
                        id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
                        beregningId: 'id1',
                        unique: 'nanoid',
                        fom: dayjs('2020-01-01T00:00:00.000Z'),
                        tom: dayjs('2020-01-31T00:00:00.000Z'),
                        type: UtbetalingshistorikkPeriodetype.VEDTAKSPERIODE,
                        tilstand: Utbetalingstatus.IKKE_UTBETALT,
                        oppgavereferanse: 'en-oppgavereferanse',
                        utbetalingstidslinje: [
                            {
                                dato: dayjs('2020-01-01'),
                                type: Dagtype.Syk,
                            },
                        ],
                        sykdomstidslinje: [
                            {
                                dato: dayjs('2020-01-01'),
                                type: Dagtype.Syk,
                            },
                        ],
                        organisasjonsnummer: '987654321',
                        fullstendig: true,
                    },
                ],
            ],
            arbeidsforhold: [
                {
                    stillingstittel: 'Potetplukker',
                    stillingsprosent: 100,
                    startdato: dayjs('2020-01-01'),
                },
            ],
        },
    ],
    infotrygdutbetalinger: [],
    tildeling: undefined,
});
