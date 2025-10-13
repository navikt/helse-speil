import { capitalizeArbeidsgiver } from './Inntektsforholdnavn';

describe('Navnsetting', () => {
    test('Beholder store bokstaver for selskapsbetegnelse (AS, ASA, NUF osv.)', () => {
        const navn = 'PENGELØS SPAREBANK AS';
        const capitalized = capitalizeArbeidsgiver(navn);
        expect(capitalized).toEqual('Pengeløs Sparebank AS');

        const navn2 = 'PENGELØS OG INTELIGENT OG LUR I HUE SPAREBANK ASA, OGDELING I BØMLO';
        const capitalized2 = capitalizeArbeidsgiver(navn2);
        expect(capitalized2).toEqual('Pengeløs og Inteligent og Lur i Hue Sparebank ASA, Ogdeling i Bømlo');
    });
});
