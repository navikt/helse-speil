import { lagLeggTilDagerSchema } from '@/form-schemas/leggTilDagerSkjema';

describe('leggTilDagerSkjema', () => {
    test('valider gyldig skjema', () => {
        const aad = lagLeggTilDagerSchema('2020-01-30');
        const result = aad.safeParse({
            fom: '2020-01-14',
            dagtype: 'Syk',
            grad: 100,
        });
        expect(result.success).toBeTruthy();
    });
    test('fom er påkrevd', () => {
        const aad = lagLeggTilDagerSchema('2020-01-30');
        const result = aad.safeParse({
            fom: undefined,
            dagtype: 'Syk',
            grad: 100,
        });
        expect(result.error?.issues[0]?.message).toBe('Fra og med er påkrevd');
    });
    test('dagtype er påkrevd', () => {
        const aad = lagLeggTilDagerSchema('2020-01-30');
        const result = aad.safeParse({
            fom: '2020-01-14',
            dagtype: undefined,
            grad: 100,
        });
        expect(result.error?.issues[0]?.message).toBe('Dagtype er påkrevd');
    });
    test('fom er gyldig dato', () => {
        const aad = lagLeggTilDagerSchema('2020-01-30');
        const result = aad.safeParse({
            fom: '2020-29-50',
            dagtype: 'Syk',
            grad: 100,
        });
        expect(result.error?.issues[0]?.message).toBe('Fra og med må være gyldig dato');
    });
    test('fom må være før tom', () => {
        const aad = lagLeggTilDagerSchema('2020-01-30');
        const result = aad.safeParse({
            fom: '2020-01-30',
            dagtype: 'Syk',
            grad: 100,
        });
        expect(result.error?.issues[0]?.message).toBe('Fra og med må være før til og med dato');
    });
    test('fom må være innenfor 16 før tom', () => {
        const aad = lagLeggTilDagerSchema('2020-01-30');
        const result = aad.safeParse({
            fom: '2020-01-13',
            dagtype: 'Syk',
            grad: 100,
        });
        expect(result.error?.issues[0]?.message).toBe('Fra og med må være maks 16 dager i forkant av til og med dato');
    });
    test('krev grad for dagtype som skal ha grad', () => {
        const aad = lagLeggTilDagerSchema('2020-01-30');
        const result = aad.safeParse({
            fom: '2020-01-29',
            dagtype: 'Syk',
            grad: undefined,
        });
        expect(result.error?.issues[0]?.message).toBe('Grad er påkrevd for dagtype');
    });
    test('krev tom grad for dagtype som skal ha grad', () => {
        const aad = lagLeggTilDagerSchema('2020-01-30');
        const result = aad.safeParse({
            fom: '2020-01-29',
            dagtype: 'Ferie',
            grad: 100,
        });
        expect(result.error?.issues[0]?.message).toBe('Dagtype uten gradering skal ikke ha grad');
    });
});
