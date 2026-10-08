import { v4 } from 'uuid';

import {
    ApiKildetype,
    ApiKravkilde,
    ApiKravkode,
    ApiManuellVilkårsvurderingRequest,
    ApiOpptjeningshistorikkInnslag,
    ApiOpptjeningshistorikkResponse,
    ApiOpptjeningsvurderingVurdertISpVilkarproving,
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
                    lovreferanse: {
                        lov: 'folketrygdloven',
                        paragraf: '8-2',
                        iKraftFra: '1997-05-01',
                    },
                    kilde: {
                        versjonAvKildekode: 'v1',
                        grunnlag: {
                            arbeidsforhold: [
                                {
                                    organisasjonsnummer: '967170232',
                                    fom: '2023-01-01',
                                    tom: null,
                                    type: 'ORDINÆRT',
                                },
                                {
                                    organisasjonsnummer: '311927825',
                                    fom: '2022-03-01',
                                    tom: '2022-12-31',
                                    type: 'FRILANSER',
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
            kravkilde: ApiKravkilde.VURDERT_I_SP_VILKARSPROVING,
        },
    ],
};

let opptjeningshistorikk: ApiOpptjeningshistorikkInnslag[] = vilkårsvurderinger.krav.map((krav) => ({
    vurdertTidspunkt: '2024-01-02T10:00:00.000Z',
    opptjeningsvurdering: krav,
}));

export const hentVilkårsvurderinger = (): ApiVilkårsvurderingerForPersonResponse => vilkårsvurderinger;

export const hentOpptjeningshistorikk = (skjæringstidspunkt: string): ApiOpptjeningshistorikkResponse => ({
    skjæringstidspunkt,
    historikk: opptjeningshistorikk,
});

export const overstyrVilkårsvurdering = (request: ApiManuellVilkårsvurderingRequest): string => {
    const nyVurdering: ApiVilkårsvurdering = {
        id: v4(),
        vilkårskode: request.vilkårskode,
        utfall: request.utfall,
        vurdertTidspunkt: new Date().toISOString(),
        lovreferanse: {
            lov: 'folketrygdloven',
            paragraf: '8-2',
            iKraftFra: '1997-05-01',
        },
        kilde: {
            ident: 'S123456',
            fritekstbegrunnelse: request.fritekstbegrunnelse,
            journalpostId: request.journalpostId,
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

    const nyttKrav: ApiOpptjeningsvurderingVurdertISpVilkarproving = {
        id: v4(),
        kravkode: ApiKravkode.OPPTJENING,
        opptjeningOk: oppfyltVurdering !== undefined,
        avgjørendeVilkårskode: (oppfyltVurdering ?? nyVurdering).vilkårskode,
        vurderinger: nyeVurderinger,
        kravkilde: ApiKravkilde.VURDERT_I_SP_VILKARSPROVING,
    };

    vilkårsvurderinger = {
        skjæringstidspunkt: request.skjæringstidspunkt,
        krav: [...vilkårsvurderinger.krav.filter((krav) => krav.kravkode !== ApiKravkode.OPPTJENING), nyttKrav],
    };

    opptjeningshistorikk = [
        { vurdertTidspunkt: nyVurdering.vurdertTidspunkt, opptjeningsvurdering: nyttKrav },
        ...opptjeningshistorikk,
    ];

    return nyttKrav.id;
};
