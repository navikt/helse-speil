import { SafeParseReturnType } from 'zod';

import { lagTilkommenInntektSchema } from '@/form-schemas/index';

const validerTilkommenInntektSkjema = (
    organisasjonsnummer: unknown = '947064649',
    fom: unknown = '2020-01-02',
    tom: unknown = '2020-01-02',
    periodebeløp: unknown = 1000,
    notat: unknown = 'Dette er et notat',
) => {
    const eksisterendePerioder = new Map();
    eksisterendePerioder.set('947064649', [
        { fom: '2020-02-01', tom: '2020-02-02' },
        { fom: '2020-03-01', tom: '2020-03-02' },
    ]);
    const vedtaksperioder = [
        {
            fom: '2020-01-01',
            tom: '2020-01-19',
            skjæringstidspunkt: '2020-01-01',
        },
    ];
    return lagTilkommenInntektSchema(vedtaksperioder, eksisterendePerioder).safeParse({
        organisasjonsnummer: organisasjonsnummer,
        fom: fom,
        tom: tom,
        periodebeløp: periodebeløp,
        notat: notat,
    });
};

const hentFeilmelding = (result: SafeParseReturnType<unknown, unknown>) => result.error?.errors[0]?.['message'];

describe('tilkommenIkktekt skjemavalidering', () => {
    it('skal validere gyldig skjema', () => {
        expect(validerTilkommenInntektSkjema().success).toBe(true);
    });

    it('organisasjonsnummer skal være tall', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('hei'))).toBe('Organisasjonsnummer må være et tall');
    });

    it('organisasjonsnummer skal være 9 sifre', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('12345678'))).toBe('Organisasjonsnummer må være 9 siffer');
        expect(hentFeilmelding(validerTilkommenInntektSkjema('1234567891'))).toBe(
            'Organisasjonsnummer må være 9 siffer',
        );
    });

    it('organisasjonsnummer skal ha gyldig kontrollsiffer', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064641'))).toBe(
            'Organisasjonsnummer må ha gyldig kontrollsiffer',
        );
    });

    it('fom skal være gyldig dato', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '2020-31-02'))).toBe('Datoen er ikke gyldig');
    });

    it('fom skal være tidligst en dag etter skjæringstidspunkt', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '2020-01-01'))).toBe(
            'Datoen må være etter skjæringstidspunktet',
        );
    });

    it('tom skal være gyldig dato', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '2020-01-02', '2020-01-99'))).toBe(
            'Datoen er ikke gyldig',
        );
    });

    it('fom skal være før tom', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '2020-01-02', '2020-01-01'))).toBe(
            'Periode f.o.m. må være før t.o.m.',
        );
    });

    it('periode skal ikke overlappe med eksisterende perioder', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '2020-01-02', '2020-02-02'))).toBe(
            'Oppgitt periode overlapper med eksisterende perioder',
        );
    });

    it('periode skal være innenfor et sykefraværstilfelle', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '2020-01-02', '2020-01-20'))).toBe(
            'Oppgitt periode skal være innenfor et sykefraværstilfelle',
        );
    });

    it('periodebeløp skal være et positivt tall', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '2020-01-02', '2020-01-03', -1000))).toBe(
            'Inntekt for perioden må være et positivt tall',
        );
    });

    it('notat må fylles ut', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '2020-01-02', '2020-01-03', 1000, ''))).toBe(
            'Notat til beslutter er påkrevd',
        );
    });
});
