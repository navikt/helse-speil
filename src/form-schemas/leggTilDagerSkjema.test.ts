import { lagEndreDagerSchema, lagLeggTilDagerSchema } from '@/form-schemas/leggTilDagerSkjema';
import { DateString } from '@typer/shared';

describe('leggTilDagerSkjema', () => {
    describe('lagLeggTilDagerSchema', () => {
        test('valider gyldig skjema', () => {
            const result = validerLeggTilDagerSchema('2020-01-30');
            expect(result.success).toBeTruthy();
        });
        test('fom er påkrevd', () => {
            expect(validerLeggTilDagerSchema('2020-01-30', null).message).toBe('Fra og med er påkrevd');
            expect(validerLeggTilDagerSchema('2020-01-30', '').message).toBe('Fra og med er påkrevd');
        });
        test('dagtype er påkrevd', () => {
            expect(validerLeggTilDagerSchema('2020-01-30', '2020-01-14', null).message).toBe('Dagtype er påkrevd');
            expect(validerLeggTilDagerSchema('2020-01-30', '2020-01-14', '').message).toBe('Dagtype er påkrevd');
        });
        test('fom er gyldig dato', () => {
            expect(validerLeggTilDagerSchema('2020-01-30', '2020-01-41').message).toBe(
                'Fra og med må være gyldig dato',
            );
        });
        test('fom må være før tom', () => {
            expect(validerLeggTilDagerSchema('2020-01-30', '2020-01-30').message).toBe(
                'Fra og med må være før til og med dato',
            );
        });
        test('fom må være innenfor 16 før tom', () => {
            expect(validerLeggTilDagerSchema('2020-01-30', '2020-01-13').message).toBe(
                'Fra og med må være maks 16 dager i forkant av til og med dato',
            );
        });
        test('krev grad for dagtype som skal ha grad', () => {
            expect(validerLeggTilDagerSchema('2020-01-30', '2020-01-14', 'Syk', null).message).toBe(
                'Grad er påkrevd for dagtype',
            );
        });
        test('krev tom grad for dagtype som ikke skal ha grad', () => {
            expect(validerLeggTilDagerSchema('2020-01-30', '2020-01-14', 'Ferie', 100).message).toBe(
                'Dagtype uten gradering skal ikke ha grad',
            );
        });
    });

    describe('lagEndreDagerSchema', () => {
        test('valider gyldig skjema', () => {
            expect(validerEndreDagerSchema(100).success).toBeTruthy();
        });
        test('dagtype er påkrevd', () => {
            expect(validerEndreDagerSchema(100, '').message).toBe('Dagtype er påkrevd');
            expect(validerEndreDagerSchema(100, null).message).toBe('Dagtype er påkrevd');
        });
        test('dagtype må være gyldig dagtype', () => {
            expect(validerEndreDagerSchema(100, 'Ugyldig').message).toBe('Ugyldig dagtype');
        });
        test('grad kan ikke være over 100 prosent', () => {
            expect(validerEndreDagerSchema(100, 'Syk', 110).message).toBe('Kan ikke sette grad høyere enn 100 %');
        });
        test('grad kan ikke være lavere enn laveste sykdomsgrad', () => {
            expect(validerEndreDagerSchema(100, 'Syk', 99).message).toBe('Kan ikke sette grad lavere enn 100 %');
            expect(validerEndreDagerSchema(50, 'Syk', 40).message).toBe('Kan ikke sette grad lavere enn 50 %');
        });
        test('krev grad for dagtype som skal ha grad', () => {
            expect(validerEndreDagerSchema(100, 'Syk', null).message).toBe('Grad er påkrevd for dagtype');
        });
        test('krev tom grad for dagtype som ikke skal ha grad', () => {
            expect(validerEndreDagerSchema(100, 'Ferie', 100).message).toBe('Dagtype uten gradering skal ikke ha grad');
        });
        test('notat til beslutter er påkrevd', () => {
            expect(validerEndreDagerSchema(100, 'Syk', 100, '').message).toBe('Notat til beslutter er påkrevd');
            expect(validerEndreDagerSchema(100, 'Syk', 100, null).message).toBe('Notat til beslutter er påkrevd');
        });
        test('notat til beslutter kan max ha 2000 tegn', () => {
            expect(validerEndreDagerSchema(100, 'Syk', 100, genererLangTekst(2001)).message).toBe('Notat er for langt');
        });
    });
});

function validerLeggTilDagerSchema(
    tom: DateString,
    fom: unknown = '2020-01-14',
    dagtype: unknown = 'Syk',
    grad: unknown = 100,
) {
    const result = lagLeggTilDagerSchema(tom).safeParse({
        fom: fom,
        dagtype: dagtype,
        grad: grad,
    });
    return {
        message: result.error?.issues[0]?.message,
        success: result.success,
    };
}

function validerEndreDagerSchema(
    lavesteSykdomsgrad: number,
    dagtype: unknown = 'Syk',
    grad: unknown = 100,
    notat: unknown = 'En begrunnelse',
) {
    const result = lagEndreDagerSchema(lavesteSykdomsgrad).safeParse({
        dagtype: dagtype,
        grad: grad,
        notat: notat,
    });
    return {
        message: result.error?.issues[0]?.message,
        success: result.success,
    };
}

function genererLangTekst(lengde: number) {
    return 'a'.repeat(lengde);
}
