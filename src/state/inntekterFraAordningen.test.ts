import { describe, expect, it } from 'vitest';

import { finnInntekterFraAordningen } from '@state/inntekterFraAordningen';

const inntekter = [
    { organisasjonsnummer: '111', skjaeringstidspunkt: '2024-01-01', inntekter: [{ maned: '2023-12', sum: 1 }] },
    { organisasjonsnummer: '222', skjaeringstidspunkt: '2024-01-01', inntekter: [{ maned: '2023-12', sum: 2 }] },
    { organisasjonsnummer: '111', skjaeringstidspunkt: '2025-01-01', inntekter: [{ maned: '2024-12', sum: 3 }] },
];

describe('finnInntekterFraAordningen', () => {
    it('finner inntektene for arbeidsgiveren på skjæringstidspunktet', () => {
        expect(finnInntekterFraAordningen(inntekter, '111', '2025-01-01')).toEqual([{ maned: '2024-12', sum: 3 }]);
        expect(finnInntekterFraAordningen(inntekter, '222', '2024-01-01')).toEqual([{ maned: '2023-12', sum: 2 }]);
    });

    it('gir undefined når arbeidsgiveren ikke har inntekter på skjæringstidspunktet', () => {
        expect(finnInntekterFraAordningen(inntekter, '222', '2025-01-01')).toBeUndefined();
    });
});
