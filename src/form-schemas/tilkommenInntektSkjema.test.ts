import { SafeParseReturnType } from 'zod';

import { lagTilkommenInntektSchema } from '@/form-schemas/index';

const validerTilkommenInntektSkjema = (
    organisasjonsnummer: unknown = '947064649',
    fom: unknown = '02.01.2020',
    tom: unknown = '02.01.2020',
    periodebeløp: unknown = 1000,
    notat: unknown = 'Dette er et notat',
) => {
    const eksisterendePerioder = new Map();
    eksisterendePerioder.set('947064649', [
        { fom: '2020-02-01', tom: '2020-02-02' },
        { fom: '2020-03-01', tom: '2020-03-02' },
    ]);
    const sykefraværstilfelleperioder = [
        {
            fom: '2020-01-01',
            tom: '2020-02-19',
            skjæringstidspunkt: '2020-01-01',
        },
    ];
    return lagTilkommenInntektSchema(
        sykefraværstilfelleperioder,
        eksisterendePerioder,
        () => '947064649' === organisasjonsnummer,
    ).safeParse({
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

    it('organisasjon må finnes i enhetsregisteret', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('123456785'))).toBe(
            'Organisasjon må eksistere i enhetsregisteret',
        );
    });

    it('fom skal være gyldig dato', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '02.31.2020'))).toBe(
            'Fra og med-datoen er ikke en gyldig norsk dato',
        );
    });

    it('fom skal være tidligst en dag etter skjæringstidspunkt', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '01.01.2020'))).toBe(
            'Fra og med-dato må være etter skjæringstidspunktet',
        );
    });

    it('tom skal være gyldig dato', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '02.01.2020', '99.01.2020'))).toBe(
            'Til og med-datoen er ikke en gyldig norsk dato',
        );
    });

    it('fom skal være før tom', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '02.01.2020', '01.01.2020'))).toBe(
            'Fra og med-dato må være før eller lik til og med-dato',
        );
    });

    it('periode skal ikke overlappe med eksisterende perioder', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '02.01.2020', '02.02.2020'))).toBe(
            'Oppgitt periode overlapper med en annen periode for arbeidsgiveren',
        );
    });

    it('periode skal være innenfor et sykefraværstilfelle', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '02.01.2020', '20.02.2020'))).toBe(
            'Oppgitt periode må være innenfor et sykefraværstilfelle',
        );
    });

    it('periodebeløp skal være et positivt tall', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '02.01.2020', '03.01.2020', -1000))).toBe(
            'Inntekt for perioden må være et positivt tall',
        );
    });

    it('notat må fylles ut', () => {
        expect(hentFeilmelding(validerTilkommenInntektSkjema('947064649', '02.01.2020', '03.01.2020', 1000, ''))).toBe(
            'Notat til beslutter er påkrevd',
        );
    });
});
