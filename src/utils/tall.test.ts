import { avrundetToDesimaler, avviksprosentVisning, isNumeric } from '@utils/tall';

describe('tall', () => {
    describe('isNumeric', () => {
        it('er true for tall', () => {
            expect(isNumeric('1')).toBe(true);
            expect(isNumeric('12')).toBe(true);
            expect(isNumeric('123')).toBe(true);
            expect(isNumeric('123.1')).toBe(true);
        });
        it('er false for bokstaver', () => {
            expect(isNumeric('a')).toBe(false);
            expect(isNumeric('ab')).toBe(false);
            expect(isNumeric('abc')).toBe(false);
        });
        it('er false for tegn', () => {
            expect(isNumeric('.')).toBe(false);
            expect(isNumeric('/')).toBe(false);
            expect(isNumeric('{}')).toBe(false);
        });
    });
    describe('avrundet', () => {
        it('skal ikke gjøre noe med hele tall', () => {
            expect(avrundetToDesimaler(100)).toBe(100);
        });
        it('skal runde av til to desimaler', () => {
            expect(avrundetToDesimaler(100.114)).toBe(100.11);
        });
        it('skal runde opp', () => {
            expect(avrundetToDesimaler(100.115)).toBe(100.12);
        });
    });
    describe('prosentvisning', () => {
        it('viser tall som prosent', () => {
            expect(avviksprosentVisning(25)).toBe('25 %');
        });
        it('avrunder til heltall', () => {
            expect(avviksprosentVisning(5.5)).toBe('6 %');
            expect(avviksprosentVisning(5.4999)).toBe('5 %');
        });
        it('viser krokodilletegn for høyere enn 25 prosent', () => {
            expect(avviksprosentVisning(25.0001)).toBe('> 25 %');
        });
        it('viser ikke krokodilletegn for eksakt 25 prosent', () => {
            expect(avviksprosentVisning(25.0)).toBe('25 %');
        });
        it('viser ikke krokodilletegn for høyere eller lik 25.5 prosent', () => {
            expect(avviksprosentVisning(25.5)).toBe('26 %');
        });
    });
});
