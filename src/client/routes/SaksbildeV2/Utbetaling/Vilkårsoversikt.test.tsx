import { arbeidsuførhet, institusjonsopphold, Vurdering, vurdering } from './Vilkårsoversikt';
import dayjs from 'dayjs';
import { Risikovurdering } from 'internal-types';

describe('Vilkåroversikt', () => {
    test('institusjonsopphold', () => {
        expect(institusjonsopphold(undefined)).toEqual({ oppfylt: undefined });
        expect(institusjonsopphold(dayjs('10-04-2020'))).toEqual({ oppfylt: undefined });
        expect(institusjonsopphold(dayjs('11-04-2020'))).toEqual({ oppfylt: true });
    });

    test('vurdering', () => {
        expect(vurdering(undefined)).toEqual(Vurdering.IkkeVurdert);
        expect(vurdering({ oppfylt: undefined })).toEqual(Vurdering.IkkeVurdert);
        expect(vurdering({ oppfylt: false })).toEqual(Vurdering.IkkeOppfylt);
        expect(vurdering({ oppfylt: true })).toEqual(Vurdering.Oppfylt);
    });

    test('arbeidsuførhet', () => {
        const risikovurderingMedVurdering: Risikovurdering = {
            arbeidsuførhetvurdering: ['vurdering'],
            ufullstendig: false,
        };

        const risikovurderingUtenVurdering: Risikovurdering = {
            arbeidsuførhetvurdering: [],
            ufullstendig: false,
        };

        const ufullstendigRisikovurdering: Risikovurdering = {
            arbeidsuførhetvurdering: [],
            ufullstendig: true,
        };

        expect(arbeidsuførhet(undefined)).toEqual({ oppfylt: undefined });
        expect(arbeidsuførhet(ufullstendigRisikovurdering)).toEqual({ oppfylt: undefined });
        expect(arbeidsuførhet(risikovurderingMedVurdering)).toEqual({ oppfylt: false });
        expect(arbeidsuførhet(risikovurderingUtenVurdering)).toEqual({ oppfylt: true });
    });
});
