import { describe, expect, it } from 'vitest';

import { ApiLøpendeVilkår, ApiSykdomsdagtype, ApiUtfallAvLøpendeVilkår } from '@io/rest/generated/spesialist.schemas';
import { enDag } from '@test-data/periode';
import { dagerUtenVurderingAvOppholdskrav, harVurderingAvOppholdskrav } from '@utils/oppholdskrav';

describe('oppholdskrav', () => {
    it('dag med vurdering av oppholdskravet er vurdert uansett utfall', () => {
        expect(harVurderingAvOppholdskrav(enDag({ vurderingerAvLøpendeVilkår: [oppholdskrav('OPPFYLT')] }))).toBe(true);
        expect(harVurderingAvOppholdskrav(enDag({ vurderingerAvLøpendeVilkår: [oppholdskrav('IKKE_OPPFYLT')] }))).toBe(
            true,
        );
        expect(harVurderingAvOppholdskrav(enDag({ vurderingerAvLøpendeVilkår: [] }))).toBe(false);
    });

    it('finner dagene med syk utenfor EØS som mangler vurdering', () => {
        const tidslinje = [
            enDag({ dato: '2020-01-01' }),
            utenforEøs('2020-01-02'),
            utenforEøs('2020-01-03', [oppholdskrav('OPPFYLT')]),
            utenforEøs('2020-01-04', [oppholdskrav('IKKE_OPPFYLT')]),
            utenforEøs('2020-01-05'),
        ];

        expect(dagerUtenVurderingAvOppholdskrav(tidslinje)).toEqual(['2020-01-02', '2020-01-05']);
    });

    it('gir ingen dager når perioden ikke har syk utenfor EØS', () => {
        expect(dagerUtenVurderingAvOppholdskrav([enDag()])).toEqual([]);
    });
});

function utenforEøs(dato: string, vurderingerAvLøpendeVilkår: ReturnType<typeof oppholdskrav>[] = []) {
    return enDag({ dato, sykdomsdagtype: ApiSykdomsdagtype.SYK_UTENFOR_EOS, vurderingerAvLøpendeVilkår });
}

function oppholdskrav(utfall: keyof typeof ApiUtfallAvLøpendeVilkår) {
    return {
        vilkår: ApiLøpendeVilkår.OPPHOLDSKRAV,
        vurderingId: 'en-vurdering',
        utfall: ApiUtfallAvLøpendeVilkår[utfall],
    };
}
