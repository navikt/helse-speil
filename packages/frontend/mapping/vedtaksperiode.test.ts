import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { ISO_TIDSPUNKTFORMAT, NORSK_DATOFORMAT } from '../utils/date';

import { umappetArbeidsgiver } from '../test/data/arbeidsgiver';
import { umappetInntektsgrunnlag } from '../test/data/inntektsgrunnlag';
import { umappetOverstyring } from '../test/data/overstyring';
import { testArbeidsgiverfagsystemId } from '../test/data/person';
import { mappetSimuleringsdata } from '../test/data/simulering';
import { mappetVedtaksperiode, umappetVedtaksperiode } from '../test/data/vedtaksperiode';
import {
    somDato,
    somInntekt,
    somKanskjeDato,
    somKanskjeTidspunkt,
    somNorskDato,
    somProsent,
    somTidspunkt,
    VedtaksperiodeBuilder,
} from './vedtaksperiode';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

test('somDato', () => {
    expect(somDato('2020-10-01').format('YYYY-MM-DD')).toEqual('2020-10-01');
});

test('somNorskDato', () => {
    expect(somNorskDato('2020-10-01').format('YYYY-MM-DD')).toEqual('2020-10-01');
});

test('somKanskjeDato', () => {
    expect(somKanskjeDato('2020-10-01')?.format('YYYY-MM-DD')).toEqual('2020-10-01');
    expect(somKanskjeDato(undefined)?.format('YYYY-MM-DD')).toEqual(undefined);
});

test('somTidspunkt', () => {
    expect(somTidspunkt('2020-10-01').format(ISO_TIDSPUNKTFORMAT)).toEqual('2020-10-01T00:00:00');
});

test('somKanskjeTidspunkt', () => {
    expect(somKanskjeTidspunkt('2020-10-01')?.format(ISO_TIDSPUNKTFORMAT)).toEqual('2020-10-01T00:00:00');
    expect(somKanskjeTidspunkt(undefined)?.format(ISO_TIDSPUNKTFORMAT)).toEqual(undefined);
});

test('somProsent', () => {
    expect(somProsent(1)).toEqual(100);
    expect(somProsent(0.333333333)).toEqual(33.3333333);
    expect(somProsent(0.331234567)).toEqual(33.1234567);
    expect(somProsent(0.677777777)).toEqual(67.7777777);
});

test('somInntekt', () => {
    expect(somInntekt(10000, 12)).toEqual(120000);
    expect(somInntekt(10000, 0)).toEqual(0);
    expect(somInntekt(12345, 10)).toEqual(123450);
});

describe('VedtaksperiodeBuilder', () => {
    test('bygger ikke vedtaksperiode hvis den mangler periodedata eller arbeidsgiver', () => {
        expect(new VedtaksperiodeBuilder().build()).toEqual({
            problems: [Error('Kan ikke mappe vedtaksperiode, mangler data.')],
            person: undefined,
        });
        expect(
            new VedtaksperiodeBuilder()
                .setArbeidsgiver(umappetArbeidsgiver())
                .setAnnullertUtbetalingshistorikk([])
                .build()
        ).toEqual({
            problems: [Error('Kan ikke mappe vedtaksperiode, mangler data.')],
            person: undefined,
        });
        expect(
            new VedtaksperiodeBuilder()
                .setVedtaksperiode(umappetVedtaksperiode())
                .setAnnullertUtbetalingshistorikk([])
                .build()
        ).toEqual({
            problems: [Error('Kan ikke mappe vedtaksperiode, mangler data.')],
            person: undefined,
        });
    });
    test('bygger vedtaksperiode', () => {
        const { vedtaksperiode, problems } = new VedtaksperiodeBuilder()
            .setArbeidsgiver(umappetArbeidsgiver())
            .setVedtaksperiode(umappetVedtaksperiode())
            .setInntektsgrunnlag([umappetInntektsgrunnlag('Inntektsmelding')])
            .setAnnullertUtbetalingshistorikk([])
            .build() as { vedtaksperiode: Vedtaksperiode; problems: Error[] };

        expect(vedtaksperiode).toEqual(mappetVedtaksperiode());
        expect(problems).toHaveLength(0);
        expect(vedtaksperiode.id).toEqual('fa02d7a5-daf2-488c-9798-2539edd7fe3f');
        expect(vedtaksperiode.fom.format(NORSK_DATOFORMAT)).toEqual('01.01.2018');
        expect(vedtaksperiode.tom.format(NORSK_DATOFORMAT)).toEqual('31.01.2018');
        expect(vedtaksperiode.gruppeId).toEqual('en-gruppeId');
        expect(vedtaksperiode.tilstand).toEqual('oppgaver');
        expect(vedtaksperiode.behandlet).toBeFalsy();
        expect(vedtaksperiode.fullstendig).toBeTruthy();
        expect(vedtaksperiode.godkjentAv).toBeUndefined();
        expect(vedtaksperiode.periodetype).toEqual('førstegangsbehandling');
        expect(vedtaksperiode.oppgavereferanse).toEqual('en-oppgavereferanse');
        expect(vedtaksperiode.godkjenttidspunkt).toBeUndefined();
        expect(vedtaksperiode.automatiskBehandlet).toBeFalsy();
        expect(vedtaksperiode.utbetalingsreferanse).toEqual('en-utbetalingsreferanse');
        expect(vedtaksperiode.forlengelseFraInfotrygd).toBeFalsy();
    });
    test('mapper oppsummering', () => {
        const { vedtaksperiode } = new VedtaksperiodeBuilder()
            .setVedtaksperiode(umappetVedtaksperiode())
            .setArbeidsgiver(umappetArbeidsgiver())
            .setAnnullertUtbetalingshistorikk([])
            .build() as { vedtaksperiode: Vedtaksperiode };

        expect(vedtaksperiode.oppsummering).toEqual({
            antallUtbetalingsdager: 23,
            totaltTilUtbetaling: 34500,
        });
    });
    test('mapper utbetalinger', () => {
        const { vedtaksperiode } = new VedtaksperiodeBuilder()
            .setVedtaksperiode(umappetVedtaksperiode())
            .setArbeidsgiver(umappetArbeidsgiver())
            .setAnnullertUtbetalingshistorikk([])
            .build() as { vedtaksperiode: Vedtaksperiode };

        expect(vedtaksperiode.utbetalinger?.personUtbetaling).toBeUndefined();

        const utbetaling = vedtaksperiode.utbetalinger?.arbeidsgiverUtbetaling;
        expect(utbetaling).not.toBeUndefined();
        expect(utbetaling?.fagsystemId).toEqual(testArbeidsgiverfagsystemId);
        expect(utbetaling?.linjer).toHaveLength(1);

        const utbetalingslinje = utbetaling?.linjer.pop() as Utbetalingslinje;
        expect(utbetalingslinje.fom.format(NORSK_DATOFORMAT)).toEqual('01.01.2018');
        expect(utbetalingslinje.tom.format(NORSK_DATOFORMAT)).toEqual('31.01.2018');
        expect(utbetalingslinje.grad).toEqual(100);
        expect(utbetalingslinje.dagsats).toEqual(1500);
    });
    test('mapper simulering', () => {
        const { vedtaksperiode } = new VedtaksperiodeBuilder()
            .setVedtaksperiode(umappetVedtaksperiode())
            .setArbeidsgiver(umappetArbeidsgiver())
            .setAnnullertUtbetalingshistorikk([])
            .build() as { vedtaksperiode: Vedtaksperiode };

        expect(vedtaksperiode.simuleringsdata).toEqual(mappetSimuleringsdata);
    });
    test('mapper overstyringer', () => {
        const { vedtaksperiode, problems } = new VedtaksperiodeBuilder()
            .setVedtaksperiode(umappetVedtaksperiode())
            .setArbeidsgiver(umappetArbeidsgiver())
            .setAnnullertUtbetalingshistorikk([])
            .setOverstyringer([umappetOverstyring()])
            .build() as { vedtaksperiode: Vedtaksperiode; problems: Error[] };

        expect(problems).toHaveLength(0);
        expect(vedtaksperiode.overstyringer).toHaveLength(1);

        const mappetOverstyring = vedtaksperiode.overstyringer.pop() as Overstyring;
        expect(mappetOverstyring.overstyrteDager).toHaveLength(1);
        expect(mappetOverstyring.overstyrteDager[0].dato.format(NORSK_DATOFORMAT)).toEqual('01.01.2018');
        expect(mappetOverstyring.overstyrteDager[0].type).toEqual('Syk');
        expect(mappetOverstyring.overstyrteDager[0].grad).toEqual(60);
    });
    test('mapper inntektsgrunnlag infotrygd', () => {
        const { vedtaksperiode, problems } = new VedtaksperiodeBuilder()
            .setVedtaksperiode(umappetVedtaksperiode())
            .setArbeidsgiver(umappetArbeidsgiver())
            .setInntektsgrunnlag([umappetInntektsgrunnlag('Infotrygd')])
            .setAnnullertUtbetalingshistorikk([])
            .setPerson({ arbeidsgivere: [umappetArbeidsgiver()] } as ExternalPerson)
            .build() as { vedtaksperiode: Vedtaksperiode; problems: Error[] };

        expect(problems).toHaveLength(0);

        const { inntektsgrunnlag } = vedtaksperiode;
        expect(Object.entries(inntektsgrunnlag ?? {})).toHaveLength(8);
        expect(inntektsgrunnlag.organisasjonsnummer).toEqual('987654321');
        expect(inntektsgrunnlag.skjæringstidspunkt.format(NORSK_DATOFORMAT)).toEqual('01.01.2018');
        expect(inntektsgrunnlag.sykepengegrunnlag).toEqual(372000);
        expect(inntektsgrunnlag.omregnetÅrsinntekt).toEqual(372000);
        expect(inntektsgrunnlag.sammenligningsgrunnlag).toBeUndefined();
        expect(inntektsgrunnlag.avviksprosent).toEqual(0);
        expect(Math.floor(inntektsgrunnlag.maksUtbetalingPerDag ?? 0)).toEqual(1430);
        expect(inntektsgrunnlag.inntekter).toHaveLength(1);

        const [inntekt] = (inntektsgrunnlag as Inntektsgrunnlag).inntekter;

        expect(Object.entries(inntekt)).toHaveLength(8);
        expect(inntekt.arbeidsgivernavn).toEqual('Potetsekk AS');
        expect(inntekt.organisasjonsnummer).toEqual('987654321');
        expect(inntekt.omregnetÅrsinntekt?.beløp).toEqual(372000);
        expect(inntekt.omregnetÅrsinntekt?.månedsbeløp).toEqual(31000);
        expect(inntekt.omregnetÅrsinntekt?.kilde).toEqual('Infotrygd');
        expect(inntekt.omregnetÅrsinntekt?.inntekterFraAOrdningen).toBeUndefined();
        expect(inntekt.sammenligningsgrunnlag).toBeUndefined();
        expect(inntekt.bransjer).toEqual(['Sofasitting', 'TV-titting']);
        expect(inntekt.refusjon).toEqual(true);
        expect(inntekt.forskuttering).toEqual(true);
        expect(inntekt.arbeidsforhold).toHaveLength(0);
    });

    test('mapper inntektsgrunnlag inntektsmelding', () => {
        const { vedtaksperiode, problems } = new VedtaksperiodeBuilder()
            .setVedtaksperiode(umappetVedtaksperiode())
            .setArbeidsgiver(umappetArbeidsgiver())
            .setInntektsgrunnlag([umappetInntektsgrunnlag()])
            .setAnnullertUtbetalingshistorikk([])
            .setPerson({ arbeidsgivere: [umappetArbeidsgiver()] } as ExternalPerson)
            .build() as { vedtaksperiode: Vedtaksperiode; problems: Error[] };

        expect(problems).toHaveLength(0);

        const { inntektsgrunnlag } = vedtaksperiode;
        expect(Object.entries(inntektsgrunnlag ?? {})).toHaveLength(8);
        expect(inntektsgrunnlag.organisasjonsnummer).toEqual('987654321');
        expect(inntektsgrunnlag.skjæringstidspunkt.format(NORSK_DATOFORMAT)).toEqual('01.01.2018');
        expect(inntektsgrunnlag.sykepengegrunnlag).toEqual(372000);
        expect(inntektsgrunnlag.omregnetÅrsinntekt).toEqual(372000);
        expect(inntektsgrunnlag.sammenligningsgrunnlag).toEqual(372000);
        expect(inntektsgrunnlag.avviksprosent).toEqual(0);
        expect(Math.floor(inntektsgrunnlag.maksUtbetalingPerDag ?? 0)).toEqual(1430);
        expect(inntektsgrunnlag.inntekter).toHaveLength(1);

        const [inntekt] = (inntektsgrunnlag as Inntektsgrunnlag).inntekter;

        expect(Object.entries(inntekt)).toHaveLength(8);
        expect(inntekt.arbeidsgivernavn).toEqual('Potetsekk AS');
        expect(inntekt.organisasjonsnummer).toEqual('987654321');
        expect(inntekt.omregnetÅrsinntekt?.beløp).toEqual(372000);
        expect(inntekt.omregnetÅrsinntekt?.månedsbeløp).toEqual(31000);
        expect(inntekt.omregnetÅrsinntekt?.kilde).toEqual('Inntektsmelding');
        expect(inntekt.omregnetÅrsinntekt?.inntekterFraAOrdningen).toBeUndefined();

        expect(inntekt.sammenligningsgrunnlag?.beløp).toEqual(372000);
        expect(inntekt.sammenligningsgrunnlag?.inntekterFraAOrdningen).toHaveLength(12);
        expect(inntekt.sammenligningsgrunnlag?.inntekterFraAOrdningen[0].sum).toEqual(31000);
        expect(inntekt.bransjer).toEqual(['Sofasitting', 'TV-titting']);
        expect(inntekt.refusjon).toEqual(true);
        expect(inntekt.forskuttering).toEqual(true);
        expect(inntekt.arbeidsforhold).toHaveLength(0);
    });

    test('vedtaksperiodetilstand skal være venter frem til Spesialist har opprettet oppgave', () => {
        const { vedtaksperiode } = new VedtaksperiodeBuilder()
            .setVedtaksperiode({
                ...umappetVedtaksperiode(),
                tilstand: 'Oppgaver',
                oppgavereferanse: null,
            })
            .setArbeidsgiver(umappetArbeidsgiver())
            .setAnnullertUtbetalingshistorikk([])
            .build() as { vedtaksperiode: Vedtaksperiode };

        expect(vedtaksperiode.tilstand).toEqual('venter');
    });
});
