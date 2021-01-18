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
import { Periodetype, Vedtaksperiode } from 'internal-types';

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
});
