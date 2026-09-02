import { v4 } from 'uuid';

import {
    ApiKildetype,
    ApiKravkilde,
    ApiKravkode,
    ApiOpptjeningsvurderingVurdertISpeil,
    ApiOverstyrVilkårsvurderingRequest,
    ApiUtfall,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/vilkarsproving.schemas';

let vilkårsvurderinger: ApiVilkårsvurderingerForPersonResponse = {
    skjæringstidspunkt: '2024-01-01',
    krav: [
        {
            id: 'krav-2',
            kravkode: ApiKravkode.OPPTJENING,
            opptjeningOk: true,
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

export const hentVilkårsvurderinger = (): ApiVilkårsvurderingerForPersonResponse => vilkårsvurderinger;

export const overstyrVilkårsvurdering = (request: ApiOverstyrVilkårsvurderingRequest): string => {
    const nyVurdering: ApiVilkårsvurdering = {
        id: v4(),
        vilkårskode: request.vilkårskode,
        utfall: request.utfall,
        vurdertTidspunkt: new Date().toISOString(),
        kilde: {
            ident: 'S123456',
            fritekstbegrunnelse: request.fritekstbegrunnelse,
            kildetype: ApiKildetype.SAKSBEHANDLER,
        },
    };

    const forrigeOpptjeningskrav = vilkårsvurderinger.krav.find((krav) => krav.kravkode === ApiKravkode.OPPTJENING);
    const tidligereVurderinger =
        forrigeOpptjeningskrav && 'vurderinger' in forrigeOpptjeningskrav
            ? forrigeOpptjeningskrav.vurderinger.filter((vurdering) => vurdering.vilkårskode !== request.vilkårskode)
            : [];

    const nyeVurderinger = [...tidligereVurderinger, nyVurdering];
    const oppfyltVurdering = nyeVurderinger.find((vurdering) => vurdering.utfall === ApiUtfall.OPPFYLT);

    const nyttKrav: ApiOpptjeningsvurderingVurdertISpeil = {
        id: v4(),
        kravkode: ApiKravkode.OPPTJENING,
        opptjeningOk: oppfyltVurdering !== undefined,
        avgjørendeVilkårskode: (oppfyltVurdering ?? nyVurdering).vilkårskode,
        vurderinger: nyeVurderinger,
        kravkilde: ApiKravkilde.VURDERT_I_SPEIL,
    };

    vilkårsvurderinger = {
        skjæringstidspunkt: request.skjæringstidspunkt,
        krav: [...vilkårsvurderinger.krav.filter((krav) => krav.kravkode !== ApiKravkode.OPPTJENING), nyttKrav],
    };

    return nyttKrav.id;
};
