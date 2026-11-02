import { cn } from './tw';

describe('cn', () => {
    it('slår sammen strenger', () => {
        expect(cn('a', 'b')).toBe('a b');
    });

    it('hopper over falsy verdier', () => {
        expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
    });

    it('tar med nøkler fra objekter når verdien er sann', () => {
        expect(cn({ a: true, b: false, c: undefined }, 'd')).toBe('a d');
    });

    it('flater ut nøstede lister', () => {
        expect(cn(['a', ['b', false && 'c'], { d: true }])).toBe('a b d');
    });

    it('lar siste tailwind-klasse vinne ved konflikt', () => {
        expect(cn('px-2 text-ax-text-neutral', 'px-4')).toBe('text-ax-text-neutral px-4');
    });
});
