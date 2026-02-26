import { v4 as uuidv4 } from 'uuid';

import {
    ApiManuellInngangsvilkårVurdering,
    ApiSamlingAvVurderteInngangsvilkår,
    AutomatiskType,
    ManuellType,
} from '@io/rest/generated/spesialist.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

type VilkårsvurderingerPerSkjæringstidspunkt = Map<string, ApiSamlingAvVurderteInngangsvilkår[]>;

export class VilkårsvurderingerMock {
    static data: Map<string, VilkårsvurderingerPerSkjæringstidspunkt> = new Map();

    static hentVurderinger = (pseudoId: string, skjaeringstidspunkt: string): ApiSamlingAvVurderteInngangsvilkår[] => {
        const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
        if (fødselsnummer === null) return [];

        if (!VilkårsvurderingerMock.data.has(fødselsnummer)) {
            VilkårsvurderingerMock.data.set(fødselsnummer, new Map());
        }

        const perSkjæringstidspunkt = VilkårsvurderingerMock.data.get(fødselsnummer)!;
        const eksisterende = perSkjæringstidspunkt.get(skjaeringstidspunkt);

        if (!eksisterende) {
            const initialeVurderinger: ApiSamlingAvVurderteInngangsvilkår = {
                samlingAvVurderteInngangsvilkårId: uuidv4(),
                versjon: 1,
                skjæringstidspunkt: skjaeringstidspunkt,
                vurderteInngangsvilkår: [
                    {
                        id: uuidv4(),
                        vilkårskode: 'MEDLEM_I_FOLKETRYGDEN',
                        vurderingskode: 'MEDLEMSKAP_JA',
                        tidspunkt: new Date().toISOString(),
                        manuellVurdering: {
                            navident: 'A123456',
                            begrunnelse: 'Han er medlem i bokklubben',
                        },
                        type: ManuellType.MANUELL,
                    },
                    {
                        id: uuidv4(),
                        vilkårskode: 'OPPTJENING',
                        vurderingskode: 'OPPTJENING_MINST_4_UKER',
                        tidspunkt: new Date().toISOString(),
                        automatiskVurdering: {
                            system: 'spleis',
                            versjon: '1.0',
                            grunnlagsdata: {},
                        },
                        type: AutomatiskType.AUTOMATISK,
                    },
                ],
            };
            perSkjæringstidspunkt.set(skjaeringstidspunkt, [initialeVurderinger]);
            return [initialeVurderinger];
        }

        return eksisterende;
    };

    static leggTilManuelleVurderinger = (
        pseudoId: string,
        skjaeringstidspunkt: string,
        _versjon: number,
        vurderinger: ApiManuellInngangsvilkårVurdering[],
    ): void => {
        const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
        if (fødselsnummer === null) return;

        if (!VilkårsvurderingerMock.data.has(fødselsnummer)) {
            VilkårsvurderingerMock.data.set(fødselsnummer, new Map());
        }
        const perSkjæringstidspunkt = VilkårsvurderingerMock.data.get(fødselsnummer)!;
        const eksisterende = perSkjæringstidspunkt.get(skjaeringstidspunkt) ?? [];

        const forrigeSamling = eksisterende.reduce<ApiSamlingAvVurderteInngangsvilkår | undefined>(
            (acc, samling) => (!acc || samling.versjon > acc.versjon ? samling : acc),
            undefined,
        );

        const endredeVilkårskoder = new Set(vurderinger.map((v) => v.vilkårskode));
        const uendredeVurderinger = (forrigeSamling?.vurderteInngangsvilkår ?? []).filter(
            (v) => !endredeVilkårskoder.has(v.vilkårskode),
        );

        const nyeVurderinger = vurderinger.map((v) => ({
            id: uuidv4(),
            vilkårskode: v.vilkårskode,
            vurderingskode: v.vurderingskode,
            tidspunkt: new Date().toISOString(),
            manuellVurdering: {
                navident: 'A123456',
                begrunnelse: v.begrunnelse,
            },
            type: ManuellType.MANUELL,
        }));

        const nyVersjon = (forrigeSamling?.versjon ?? 0) + 1;

        const nySamling: ApiSamlingAvVurderteInngangsvilkår = {
            samlingAvVurderteInngangsvilkårId: uuidv4(),
            versjon: nyVersjon,
            skjæringstidspunkt: skjaeringstidspunkt,
            vurderteInngangsvilkår: [...uendredeVurderinger, ...nyeVurderinger],
        };

        perSkjæringstidspunkt.set(skjaeringstidspunkt, [...eksisterende, nySamling]);
    };
}
