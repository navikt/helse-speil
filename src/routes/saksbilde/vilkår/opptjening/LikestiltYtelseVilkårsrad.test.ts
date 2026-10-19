import {
    ApiKildetype,
    ApiUtfall,
    ApiVilkårskode,
    ApiVilkårsvurdering,
} from '@io/rest/generated/vilkarsproving.schemas';

import { utledLikestiltYtelse } from './LikestiltYtelseVilkårsrad';

describe('utledLikestiltYtelse', () => {
    it('er ikke vurdert uten vurdering av første punktum', () => {
        expect(utledLikestiltYtelse({})).toEqual({ utfall: 'IkkeVurdert' });
    });

    it('scenario B: oppfylt etter første punktum', () => {
        expect(utledLikestiltYtelse({ første: oppfylt })).toEqual({
            utfall: 'Oppfylt',
            hjemmel: '§ 8-2 andre ledd første punktum',
        });
        expect(utledLikestiltYtelse({ første: oppfylt, andre: oppfylt })).toEqual({
            utfall: 'Oppfylt',
            hjemmel: '§ 8-2 andre ledd første punktum',
        });
    });

    it('scenario C: oppfylt etter tredje punktum når foreldrepengene er opptjent på AAP', () => {
        expect(utledLikestiltYtelse({ første: oppfylt, andre: ikkeOppfylt, tredje: oppfylt })).toEqual({
            utfall: 'Oppfylt',
            hjemmel: '§ 8-2 andre ledd tredje punktum',
        });
    });

    it('scenario D: ikke oppfylt etter første punktum', () => {
        expect(utledLikestiltYtelse({ første: ikkeOppfylt })).toEqual({
            utfall: 'IkkeOppfylt',
            hjemmel: '§ 8-2 andre ledd første punktum',
        });
    });

    it('scenario E: ikke oppfylt etter andre punktum, jf. tredje', () => {
        expect(utledLikestiltYtelse({ første: oppfylt, andre: ikkeOppfylt, tredje: ikkeOppfylt })).toEqual({
            utfall: 'IkkeOppfylt',
            hjemmel: '§ 8-2 andre ledd andre punktum, jf. tredje punktum',
        });
    });
});

const oppfylt = vurdering(ApiUtfall.OPPFYLT);
const ikkeOppfylt = vurdering(ApiUtfall.IKKE_OPPFYLT);

function vurdering(utfall: ApiUtfall): ApiVilkårsvurdering {
    return {
        id: 'id',
        vilkårskode: ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER,
        utfall,
        vurdertTidspunkt: '2024-01-03T10:00:00.000Z',
        lovreferanse: { lov: 'folketrygdloven', paragraf: '8-2', iKraftFra: '1997-01-01' },
        kilde: {
            ident: 'S123456',
            fritekstbegrunnelse: 'Begrunnelse',
            journalpostId: [],
            ytelser: [],
            kildetype: ApiKildetype.SAKSBEHANDLER,
        },
    };
}
