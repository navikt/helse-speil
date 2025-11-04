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
        test('krev tom grad for dagtype som skal ha grad', () => {
            expect(validerLeggTilDagerSchema('2020-01-30', '2020-01-14', 'Ferie', 100).message).toBe(
                'Dagtype uten gradering skal ikke ha grad',
            );
        });
    });

    describe('lagEndreDagerSchema', () => {
        test('valider gyldig skjema', () => {
            expect(validerEndreDagerSchema(100).success).toBeTruthy();
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

function validerEndreDagerSchema(lavesteSykdomsgrad: number, dagtype: unknown = 'Syk', grad: unknown = 100) {
    const result = lagEndreDagerSchema(lavesteSykdomsgrad).safeParse({
        dagtype: dagtype,
        grad: grad,
    });
    return {
        message: result.error?.issues[0]?.message,
        success: result.success,
    };
}
