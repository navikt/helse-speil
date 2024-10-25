import { capitalizeArbeidsgiver, capitalizeName } from './locale';

describe('Navnsetting', () => {
    test('Stor forbokstav i navn nr 2 når bruker har navn med bindestrek', () => {
        const navn = 'ole-erik nordmann';
        const capitalized = capitalizeName(navn);
        expect(capitalized).toEqual('Ole-Erik Nordmann');

        const navn2 = 'Ole-Erik Nordmann';
        const capitalized2 = capitalizeName(navn2);
        expect(capitalized2).toEqual('Ole-Erik Nordmann');
    });

    test('Beholder store bokstaver for selskapsbetegnelse (AS, ASA, NUF osv.)', () => {
        const navn = 'PENGELØS SPAREBANK AS';
        const capitalized = capitalizeArbeidsgiver(navn);
        expect(capitalized).toEqual('Pengeløs Sparebank AS');

        const navn2 = 'PENGELØS SPAREBANK ASA, AVDELING BØMLO';
        const capitalized2 = capitalizeArbeidsgiver(navn2);
        expect(capitalized2).toEqual('Pengeløs Sparebank ASA, Avdeling Bømlo');
    });
});
