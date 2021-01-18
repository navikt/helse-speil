import dayjs, { Dayjs } from 'dayjs';
import { sykdomstidslinje } from './sykdomstidslinje';
import { utbetalingstidslinje } from './utbetalingstidslinje';
import { totalbeløpArbeidstaker, utbetalinger } from './utbetalinger';
import { dataForVilkårsvurdering, umappedeVilkår } from './vilkår';
import { hendelser } from './hendelser';
import {
    SpesialistOverstyring,
    SpesialistVedtaksperiode,
    SpleisAktivitet,
    SpleisForlengelseFraInfotrygd,
    SpleisPeriodetype,
    SpleisSykdomsdag,
    SpleisUtbetalingsdag,
    SpleisVedtaksperiodetilstand,
} from 'external-types';
import { VedtaksperiodeBuilder } from '../../client/mapping/vedtaksperiode';
import { Vedtaksperiode } from 'internal-types';
import { aktivitetslogg } from './aktivitetslogg';
import { umappetArbeidsgiver } from './arbeidsgiver';

type UmappetVedtaksperiodeOptions = {
    fom?: Dayjs;
    tom?: Dayjs;
    aktivitetslogg?: SpleisAktivitet[];
    varsler?: string[];
};

export const umappetVedtaksperiode = (options?: UmappetVedtaksperiodeOptions): SpesialistVedtaksperiode => {
    const fom = options?.fom ?? dayjs('2020-01-01');
    const tom = options?.tom ?? dayjs('2020-01-31');
    const aktivitetsloggen = options?.aktivitetslogg ?? aktivitetslogg();
    const varslene = options?.varsler ?? [];

    const sykdomsdager = sykdomstidslinje(fom, tom);
    const utbetalingsdager = utbetalingstidslinje(sykdomsdager, 1500);
    const utbetalingene = utbetalinger(utbetalingsdager, true);
    return {
        id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
        fom: fom.format('YYYY-MM-DD'),
        tom: tom.format('YYYY-MM-DD'),
        gruppeId: 'en-gruppeId',
        tilstand: SpleisVedtaksperiodetilstand.Oppgaver,
        oppgavereferanse: 'en-oppgavereferanse',
        fullstendig: true,
        utbetalingsreferanse: 'en-utbetalingsreferanse',
        utbetalingstidslinje: utbetalingsdager,
        sykdomstidslinje: sykdomsdager,
        utbetalinger: utbetalingene,
        automatiskBehandlet: false,
        vilkår: umappedeVilkår(sykdomsdager),
        inntektFraInntektsmelding: 31000.0,
        totalbeløpArbeidstaker: totalbeløpArbeidstaker(utbetalingsdager),
        hendelser: hendelser(sykdomsdager),
        dataForVilkårsvurdering: dataForVilkårsvurdering(),
        utbetalingslinjer: utbetalingene.arbeidsgiverUtbetaling?.linjer ?? [],
        aktivitetslogg: aktivitetsloggen,
        forlengelseFraInfotrygd: SpleisForlengelseFraInfotrygd.NEI,
        periodetype: SpleisPeriodetype.FØRSTEGANGSBEHANDLING,
        risikovurdering: { arbeidsuførhetvurdering: [], ufullstendig: false },
        varsler: varslene,
    };
};

export const medUtbetalingstidslinje = (
    vedtaksperiode: SpesialistVedtaksperiode,
    tidslinje: SpleisUtbetalingsdag[]
) => ({
    ...vedtaksperiode,
    utbetalingstidslinje: tidslinje,
    totalbeløpArbeidstaker: totalbeløpArbeidstaker(tidslinje),
});

export const medLedendeSykdomsdager = (vedtaksperiode: SpesialistVedtaksperiode, sykdomsdager: SpleisSykdomsdag[]) => ({
    ...vedtaksperiode,
    fom: sykdomsdager[0].dagen,
    sykdomstidslinje: [...sykdomsdager, ...vedtaksperiode.sykdomstidslinje],
});

export const medEkstraSykdomsdager = (vedtaksperiode: SpesialistVedtaksperiode, sykdomsdager: SpleisSykdomsdag[]) => ({
    ...vedtaksperiode,
    sykdomstidslinje: [...vedtaksperiode.sykdomstidslinje, ...sykdomsdager],
});

export const mappetVedtaksperiode = (
    fom: Dayjs = dayjs('2020-01-01'),
    tom: Dayjs = dayjs('2020-01-31'),
    organisasjonsnummer: string = 'et-organisasjonsnummer',
    overstyringer: SpesialistOverstyring[] = []
): Vedtaksperiode => {
    const { vedtaksperiode } = new VedtaksperiodeBuilder()
        .setVedtaksperiode(umappetVedtaksperiode({ fom, tom }))
        .setArbeidsgiver(umappetArbeidsgiver())
        .setOverstyringer(overstyringer)
        .build();
    return vedtaksperiode as Vedtaksperiode;
};

// const mappet = {
//     id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
//     gruppeId: 'en-gruppeId',
//     godkjentAv: undefined,
//     godkjenttidspunkt: undefined,
//     oppgavereferanse: 'en-oppgavereferanse',
//     utbetalingsreferanse: 'en-utbetalingsreferanse',
//     kanVelges: true,
//     vilkår: {
//         alder: { alderSisteSykedag: 28, oppfylt: true },
//         sykepengegrunnlag: { sykepengegrunnlag: 372000, oppfylt: true, grunnebeløp: 99858 },
//         dagerIgjen: {
//             dagerBrukt: 3,
//             skjæringstidspunkt: dayjs(),
//             førsteSykepengedag: dayjs(),
//             maksdato: dayjs(),
//             oppfylt: true,
//             gjenståendeDager: undefined,
//             tidligerePerioder: [],
//         },
//         søknadsfrist: { sendtNav: dayjs(), søknadTom: dayjs(), oppfylt: true },
//         opptjening: {
//             antallOpptjeningsdagerErMinst: 3539,
//             oppfylt: true,
//             opptjeningFra: dayjs(),
//         },
//         medlemskap: { oppfylt: true },
//     },
//     tilstand: 'oppgaver',
//     fom: dayjs('2020-01-01'),
//     tom: dayjs('2020-01-31'),
//     hendelser: [
//         {
//             id: 'c554ee9b-30ca-4c7f-adce-c0224108e83a',
//             type: 'Sykmelding',
//             fom: dayjs(),
//             tom: dayjs(),
//             rapportertDato: dayjs(),
//         },
//         {
//             id: '726e57d9-7844-4a28-886b-8485dbdbd4d2',
//             type: 'Søknad',
//             fom: dayjs(),
//             tom: dayjs(),
//             sendtNav: dayjs(),
//             rapportertDato: dayjs(),
//         },
//         {
//             id: '09851096-bcba-4c7a-8dc0-a1617a744f1f',
//             type: 'Inntektsmelding',
//             beregnetInntekt: 31000,
//             mottattTidspunkt: dayjs(),
//         },
//     ],
//     sykdomstidslinje: [
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Søknad',
//             kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Søknad',
//             kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Søknad',
//             kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Søknad',
//             kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Søknad',
//             kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Søknad',
//             kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Søknad',
//             kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Søknad',
//             kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             kilde: 'Sykmelding',
//             kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
//         },
//     ],
//     utbetalingstidslinje: [
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: undefined,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: undefined,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: undefined,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: undefined,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: undefined,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: undefined,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: undefined,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Helg',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: undefined,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//         {
//             type: 'Syk',
//             dato: dayjs(),
//             gradering: 100,
//             utbetaling: 1500,
//             avvistÅrsak: undefined,
//         },
//     ],
//     simuleringsdata: undefined,
//     periodetype: 'førstegangsbehandling',
//     utbetalinger: {
//         arbeidsgiverUtbetaling: { fagsystemId: 'en-fagsystem-id', linjer: [Array] },
//         personUtbetaling: undefined,
//     },
//     oppsummering: { antallUtbetalingsdager: 23, totaltTilUtbetaling: 34500 },
//     overstyringer: [],
//     inntektskilder: [
//         {
//             arbeidsgiver: 'Potetsekk AS',
//             bransjer: [Array],
//             organisasjonsnummer: '987654321',
//             månedsinntekt: 31000,
//             årsinntekt: 372000,
//             refusjon: true,
//             forskuttering: true,
//             arbeidsforhold: [],
//         },
//     ],
//     aktivitetslog: ['Aktivitetsloggvarsel'],
//     risikovurdering: { arbeidsuførhetvurdering: [], ufullstendig: false },
//     inntektsgrunnlag: undefined,
//     sykepengegrunnlag: {
//         arbeidsgivernavn: 'Potetsekk AS',
//         årsinntektFraAording: 372000,
//         årsinntektFraInntektsmelding: 372000,
//         avviksprosent: 0,
//         sykepengegrunnlag: 372000,
//     },
//     behandlet: false,
//     automatiskBehandlet: false,
//     forlengelseFraInfotrygd: false,
// };
