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
import { ISO_TIDSPUNKTFORMAT, NORSK_DATOFORMAT } from '../utils/date';
import { umappetArbeidsgiver } from '../../test/data/arbeidsgiver';
import { mappetVedtaksperiode, umappetVedtaksperiode } from '../../test/data/vedtaksperiode';
import {
    Arbeidsforhold,
    Dagtype,
    Inntektsgrunnlag,
    Inntektskilde,
    Inntektskildetype,
    Overstyring,
    Periodetype,
    Utbetalingslinje,
    Vedtaksperiode,
    Vedtaksperiodetilstand,
} from 'internal-types';
import { mappetSimuleringsdata } from '../../test/data/simulering';
import { umappetOverstyring } from '../../test/data/overstyring';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { umappetArbeidsforhold } from '../../test/data/arbeidsforhold';
import { SpesialistPerson } from 'external-types';
import { umappetInntektsgrunnlag } from '../../test/data/inntektsgrunnlag';

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
        expect(new VedtaksperiodeBuilder().setArbeidsgiver(umappetArbeidsgiver()).build()).toEqual({
            problems: [Error('Kan ikke mappe vedtaksperiode, mangler data.')],
            person: undefined,
        });
        expect(new VedtaksperiodeBuilder().setVedtaksperiode(umappetVedtaksperiode()).build()).toEqual({
            problems: [Error('Kan ikke mappe vedtaksperiode, mangler data.')],
            person: undefined,
        });
    });
    test('bygger vedtaksperiode', () => {
        const { vedtaksperiode, problems } = new VedtaksperiodeBuilder()
            .setVedtaksperiode(umappetVedtaksperiode())
            .setArbeidsgiver(umappetArbeidsgiver())
            .build() as { vedtaksperiode: Vedtaksperiode; problems: Error[] };

        expect(vedtaksperiode).toEqual(mappetVedtaksperiode());
        expect(problems).toHaveLength(0);
        expect(vedtaksperiode.id).toEqual('fa02d7a5-daf2-488c-9798-2539edd7fe3f');
        expect(vedtaksperiode.fom.format(NORSK_DATOFORMAT)).toEqual('01.01.2020');
        expect(vedtaksperiode.tom.format(NORSK_DATOFORMAT)).toEqual('31.01.2020');
        expect(vedtaksperiode.gruppeId).toEqual('en-gruppeId');
        expect(vedtaksperiode.tilstand).toEqual(Vedtaksperiodetilstand.Oppgaver);
        expect(vedtaksperiode.behandlet).toBeFalsy();
        expect(vedtaksperiode.kanVelges).toBeTruthy();
        expect(vedtaksperiode.godkjentAv).toBeUndefined();
        expect(vedtaksperiode.periodetype).toEqual(Periodetype.Førstegangsbehandling);
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
            .build() as { vedtaksperiode: Vedtaksperiode };

        expect(vedtaksperiode.utbetalinger?.personUtbetaling).toBeUndefined();

        const utbetaling = vedtaksperiode.utbetalinger?.arbeidsgiverUtbetaling;
        expect(utbetaling).not.toBeUndefined();
        expect(utbetaling?.fagsystemId).toEqual('en-fagsystem-id');
        expect(utbetaling?.linjer).toHaveLength(1);

        const utbetalingslinje = utbetaling?.linjer.pop() as Utbetalingslinje;
        expect(utbetalingslinje.fom.format(NORSK_DATOFORMAT)).toEqual('01.01.2020');
        expect(utbetalingslinje.tom.format(NORSK_DATOFORMAT)).toEqual('31.01.2020');
        expect(utbetalingslinje.grad).toEqual(100);
        expect(utbetalingslinje.dagsats).toEqual(1500);
    });
    test('mapper simulering', () => {
        const { vedtaksperiode } = new VedtaksperiodeBuilder()
            .setVedtaksperiode(umappetVedtaksperiode())
            .setArbeidsgiver(umappetArbeidsgiver())
            .build() as { vedtaksperiode: Vedtaksperiode };

        expect(vedtaksperiode.simuleringsdata).toEqual(mappetSimuleringsdata);
    });
    test('mapper sykepengegrunnlag', () => {
        const { vedtaksperiode } = new VedtaksperiodeBuilder()
            .setVedtaksperiode(umappetVedtaksperiode())
            .setArbeidsgiver(umappetArbeidsgiver())
            .build() as { vedtaksperiode: Vedtaksperiode };

        const { sykepengegrunnlag } = vedtaksperiode;
        expect(Object.entries(sykepengegrunnlag)).toHaveLength(5);
        expect(sykepengegrunnlag.arbeidsgivernavn).toEqual('Potetsekk AS');
        expect(sykepengegrunnlag.avviksprosent).toEqual(0);
        expect(sykepengegrunnlag.sykepengegrunnlag).toEqual(372000);
        expect(sykepengegrunnlag.årsinntektFraAording).toEqual(372000);
        expect(sykepengegrunnlag.årsinntektFraInntektsmelding).toEqual(372000);
    });
    test('mapper overstyringer', () => {
        const { vedtaksperiode, problems } = new VedtaksperiodeBuilder()
            .setVedtaksperiode(umappetVedtaksperiode())
            .setArbeidsgiver(umappetArbeidsgiver())
            .setOverstyringer([umappetOverstyring])
            .build() as { vedtaksperiode: Vedtaksperiode; problems: Error[] };

        expect(problems).toHaveLength(0);
        expect(vedtaksperiode.overstyringer).toHaveLength(1);

        const mappetOverstyring = vedtaksperiode.overstyringer.pop() as Overstyring;
        expect(mappetOverstyring.overstyrteDager).toHaveLength(1);
        expect(mappetOverstyring.overstyrteDager[0].dato.format(NORSK_DATOFORMAT)).toEqual('01.01.2020');
        expect(mappetOverstyring.overstyrteDager[0].type).toEqual(Dagtype.Syk);
        expect(mappetOverstyring.overstyrteDager[0].grad).toEqual(60);
    });
    test('mapper inntektskilder', () => {
        const { vedtaksperiode, problems } = new VedtaksperiodeBuilder()
            .setVedtaksperiode(umappetVedtaksperiode())
            .setArbeidsgiver(umappetArbeidsgiver())
            .setPerson({ arbeidsforhold: [umappetArbeidsforhold] } as SpesialistPerson)
            .build() as { vedtaksperiode: Vedtaksperiode; problems: Error[] };

        expect(problems).toHaveLength(0);
        expect(vedtaksperiode.inntektskilder).toHaveLength(1);

        const inntektskilde = vedtaksperiode.inntektskilder.pop() as Inntektskilde;
        expect(inntektskilde.arbeidsgiver).toEqual('Potetsekk AS');
        expect(inntektskilde.bransjer).toEqual(['Sofasitting', 'TV-titting']);
        expect(inntektskilde.organisasjonsnummer).toEqual('987654321');
        expect(inntektskilde.forskuttering).toBeTruthy();
        expect(inntektskilde.refusjon).toBeTruthy();
        expect(inntektskilde.årsinntekt).toEqual(372000);
        expect(inntektskilde.månedsinntekt).toEqual(31000);
        expect(inntektskilde.arbeidsforhold).toHaveLength(1);

        const arbeidsforhold = inntektskilde.arbeidsforhold.pop() as Arbeidsforhold;
        expect(arbeidsforhold.stillingsprosent).toEqual(100);
        expect(arbeidsforhold.stillingstittel).toEqual('UNNASLUNTRER');
        expect(arbeidsforhold.sluttdato).toBeUndefined();
        expect(arbeidsforhold.startdato.format(NORSK_DATOFORMAT)).toEqual('17.01.1991');
    });
    test('mapper inntektsgrunnlag', () => {
        const { vedtaksperiode, problems } = new VedtaksperiodeBuilder()
            .setVedtaksperiode(umappetVedtaksperiode())
            .setArbeidsgiver(umappetArbeidsgiver())
            .setInntektsgrunnlag([umappetInntektsgrunnlag])
            .setPerson({ arbeidsgivere: [umappetArbeidsgiver()] } as SpesialistPerson)
            .build() as { vedtaksperiode: Vedtaksperiode; problems: Error[] };

        expect(problems).toHaveLength(0);

        const { inntektsgrunnlag } = vedtaksperiode;
        expect(Object.entries(inntektsgrunnlag ?? {})).toHaveLength(8);
        expect(inntektsgrunnlag?.organisasjonsnummer).toEqual('987654321');
        expect(inntektsgrunnlag?.skjæringstidspunkt.format(NORSK_DATOFORMAT)).toEqual('01.01.2020');
        expect(inntektsgrunnlag?.sykepengegrunnlag).toEqual(744000);
        expect(inntektsgrunnlag?.omregnetÅrsinntekt).toEqual(740000);
        expect(inntektsgrunnlag?.sammenligningsgrunnlag).toBeUndefined();
        expect(inntektsgrunnlag?.avviksprosent).toBeUndefined();
        expect(Math.floor(inntektsgrunnlag?.maksUtbetalingPerDag ?? 0)).toEqual(1430);
        expect(inntektsgrunnlag?.inntekter).toHaveLength(2);

        const [inntekt] = (inntektsgrunnlag as Inntektsgrunnlag).inntekter;

        expect(Object.entries(inntekt)).toHaveLength(4);
        expect(inntekt.arbeidsgivernavn).toEqual('Potetsekk AS');
        expect(inntekt.organisasjonsnummer).toEqual('987654321');
        expect(inntekt.sammenligningsgrunnlag).toBeUndefined();
        expect(inntekt.omregnetÅrsinntekt?.beløp).toEqual(372000);
        expect(inntekt.omregnetÅrsinntekt?.månedsbeløp).toEqual(31000);
        expect(inntekt.omregnetÅrsinntekt?.kilde).toEqual(Inntektskildetype.Infotrygd);
        expect(inntekt.omregnetÅrsinntekt?.inntekterFraAOrdningen).toBeUndefined();
    });
});
