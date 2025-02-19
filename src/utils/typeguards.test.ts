import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { isNotNullOrUndefined } from '@utils/typeguards';

describe('typeguards', () => {
    describe('isNotNullOrUndefined', () => {
        it('er false for null og undefined', () => {
            expect(isNotNullOrUndefined(undefined)).toBe(false);
            expect(isNotNullOrUndefined(null)).toBe(false);
        });

        it('er true for objekter', () => {
            expect(isNotNullOrUndefined(enBeregnetPeriode())).toBe(true);
            expect(isNotNullOrUndefined(enPerson())).toBe(true);
            expect(isNotNullOrUndefined({})).toBe(true);
        });

        it('er true for tall', () => {
            expect(isNotNullOrUndefined(1)).toBe(true);
            expect(isNotNullOrUndefined(1.1)).toBe(true);
            expect(isNotNullOrUndefined(0)).toBe(true);
        });

        it('er true for booleans', () => {
            expect(isNotNullOrUndefined(true)).toBe(true);
            expect(isNotNullOrUndefined(false)).toBe(true);
        });

        it('er true for string', () => {
            expect(isNotNullOrUndefined('tekst')).toBe(true);
            expect(isNotNullOrUndefined('')).toBe(true);
        });
    });
});
