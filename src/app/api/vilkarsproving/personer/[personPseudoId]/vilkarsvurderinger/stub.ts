import {
    ApiKildetype,
    ApiKravkilde,
    ApiKravkode,
    ApiUtfall,
    ApiVilkårskode,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/vilkarsproving.schemas';

const vilkarsvurderingerStub: ApiVilkårsvurderingerForPersonResponse = {
    skjæringstidspunkt: '2024-01-01',
    krav: [
        {
            id: 'krav-2',
            kravkode: ApiKravkode.OPPTJENING,
            rettTilSykepenger: true,
            avgjørendeVilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
            vurderinger: [
                {
                    id: 'vurdering-1',
                    vilkårskode: ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
                    utfall: ApiUtfall.OPPFYLT,
                    vurdertTidspunkt: '2024-01-02T10:00:00.000Z',
                    kilde: {
                        versjonAvKildekode: 'v1',
                        grunnlag: {
                            arbeidsforhold: [
                                {
                                    organisasjonsnummer: '123456789',
                                    fom: '2023-01-01',
                                    tom: null,
                                    type: 'ORDINÆRT',
                                },
                            ],
                            opptjeningsperiode: {
                                fom: '2023-01-01',
                                tom: '2023-12-31',
                            },
                            opptjeningsdager: 120,
                            grunnlagstype: 'ARBEIDSFORHOLD',
                        },
                        kildetype: ApiKildetype.AUTOMATISK,
                    },
                },
            ],
            kravkilde: ApiKravkilde.VURDERT_I_SPEIL,
        },
    ],
};

export const stub = async () => Response.json(vilkarsvurderingerStub);
