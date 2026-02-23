import { v4 as uuidv4 } from 'uuid';

import {
    ApiManuellInngangsvilkårVurdering,
    ApiSamlingAvVurderteInngangsvilkår,
    ManuellType,
} from '@io/rest/generated/spesialist.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

type VilkårsvurderingerPerSkjæringstidspunkt = Map<string, ApiSamlingAvVurderteInngangsvilkår[]>;

export class VilkårsvurderingerMock {
    static data: Map<string, VilkårsvurderingerPerSkjæringstidspunkt> = new Map();

    static hentVurderinger = (pseudoId: string, skjaeringstidspunkt: string): ApiSamlingAvVurderteInngangsvilkår[] => {
        const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
        if (fødselsnummer === null) return [];
        return VilkårsvurderingerMock.data.get(fødselsnummer)?.get(skjaeringstidspunkt) ?? [];
    };

    static leggTilManuelleVurderinger = (
        pseudoId: string,
        skjaeringstidspunkt: string,
        versjon: number,
        vurderinger: ApiManuellInngangsvilkårVurdering[],
    ): void => {
        const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
        if (fødselsnummer === null) return;

        if (!VilkårsvurderingerMock.data.has(fødselsnummer)) {
            VilkårsvurderingerMock.data.set(fødselsnummer, new Map());
        }
        const perSkjæringstidspunkt = VilkårsvurderingerMock.data.get(fødselsnummer)!;
        const eksisterende = perSkjæringstidspunkt.get(skjaeringstidspunkt) ?? [];

        const nyeSamlinger: ApiSamlingAvVurderteInngangsvilkår = {
            samlingAvVurderteInngangsvilkårId: uuidv4(),
            versjon: versjon + 1,
            skjæringstidspunkt: skjaeringstidspunkt,
            vurderteInngangsvilkår: vurderinger.map((v) => ({
                vilkårskode: v.vilkårskode,
                vurderingskode: v.vurderingskode,
                tidspunkt: v.tidspunkt,
                manuellVurdering: {
                    navident: 'A123456',
                    begrunnelse: v.begrunnelse,
                },
                type: ManuellType.MANUELL,
            })),
        };

        perSkjæringstidspunkt.set(skjaeringstidspunkt, [...eksisterende, nyeSamlinger]);
    };
}
