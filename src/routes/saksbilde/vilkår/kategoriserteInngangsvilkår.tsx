import React, { ReactElement } from 'react';

import { BodyShort, Loader } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import { VilkarsgrunnlagInfotrygdV2, VilkarsgrunnlagSpleisV2, VilkarsgrunnlagVurdering, Vurdering } from '@io/graphql';
import {
    ApiKravkode,
    ApiVilkårsvurderingerForPersonResponse,
    ApiVurderingsgrunnlag,
    ApiVurderingsgrunnlagArbeidsforhold,
} from '@io/rest/generated/vilkarsproving.schemas';
import { Vilkårdata, Vilkårstype } from '@typer/vilkår';

import { EndretParagrafContainer } from './EndretParagrafContainer';
import { OpptjeningstidArbeidstaker, Sykepengegrunnlag } from './vilkårsgrupper/Vilkårsgrupper';

const VilkårManglerData = (): ReactElement => <BodyShort>Mangler data om vilkåret</BodyShort>;

export interface SpVilkårsvurdering {
    isLoading: boolean;
    isError: boolean;
    data?: ApiVilkårsvurderingerForPersonResponse;
}

const erArbeidsforholdGrunnlag = (grunnlag: ApiVurderingsgrunnlag): grunnlag is ApiVurderingsgrunnlagArbeidsforhold =>
    'arbeidsforhold' in grunnlag;

const finnOpptjeningskrav = (data: ApiVilkårsvurderingerForPersonResponse) =>
    data.krav.find((krav) => krav.kravkode === ApiKravkode.OPPTJENING);

const opptjeningstidFraSpVilkårsvurdering = (spVilkårsvurdering: SpVilkårsvurdering): Vilkårdata => {
    const paragraf = <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>;
    const tittel = 'Opptjeningstid';

    if (spVilkårsvurdering.isLoading) {
        return {
            type: Vilkårstype.Opptjeningstid,
            tittel,
            paragraf,
            oppfylt: null,
            komponent: <Loader size="small" />,
        };
    }

    const krav = spVilkårsvurdering.data && finnOpptjeningskrav(spVilkårsvurdering.data);

    if (spVilkårsvurdering.isError || !krav) {
        return { type: Vilkårstype.Opptjeningstid, tittel, paragraf, oppfylt: null, komponent: <VilkårManglerData /> };
    }

    if (!('vurderinger' in krav)) {
        return {
            type: Vilkårstype.Opptjeningstid,
            tittel,
            paragraf,
            oppfylt: krav.rettTilSykepenger,
            komponent: <VilkårManglerData />,
        };
    }

    const vurdering =
        krav.vurderinger.find((it) => it.vilkårskode === krav.avgjørendeVilkårskode) ?? krav.vurderinger[0];
    const grunnlag = vurdering && 'grunnlag' in vurdering.kilde ? vurdering.kilde.grunnlag : undefined;

    if (grunnlag && erArbeidsforholdGrunnlag(grunnlag) && grunnlag.opptjeningsperiode) {
        return {
            type: Vilkårstype.Opptjeningstid,
            tittel,
            paragraf,
            oppfylt: krav.rettTilSykepenger,
            komponent: (
                <OpptjeningstidArbeidstaker
                    opptjeningFra={grunnlag.opptjeningsperiode.fom}
                    antallOpptjeningsdagerErMinst={grunnlag.opptjeningsdager}
                />
            ),
        };
    }

    return {
        type: Vilkårstype.Opptjeningstid,
        tittel,
        paragraf,
        oppfylt: krav.rettTilSykepenger,
        komponent: <></>,
    };
};

const opptjeningstid = (
    erSelvstendigNæring: boolean,
    vilkår: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2,
    spVilkårsvurdering?: SpVilkårsvurdering,
): Vilkårdata => {
    if (spVilkårsvurdering) {
        return opptjeningstidFraSpVilkårsvurdering(spVilkårsvurdering);
    }

    switch (vilkår.__typename) {
        case 'VilkarsgrunnlagSpleisV2': {
            if (erSelvstendigNæring) {
                return {
                    type: Vilkårstype.Opptjeningstid,
                    oppfylt: vilkår.oppfyllerKravOmOpptjening,
                    tittel: 'Opptjeningstid',
                    paragraf: <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>,
                    komponent: <></>,
                };
            }
            return {
                type: Vilkårstype.Opptjeningstid,
                oppfylt: vilkår.oppfyllerKravOmOpptjening,
                tittel: 'Opptjeningstid',
                paragraf: <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>,
                komponent: (
                    <OpptjeningstidArbeidstaker
                        opptjeningFra={vilkår.opptjeningFra}
                        antallOpptjeningsdagerErMinst={vilkår.antallOpptjeningsdagerErMinst}
                    />
                ),
            };
        }
        case 'VilkarsgrunnlagInfotrygdV2':
            return {
                type: Vilkårstype.Opptjeningstid,
                tittel: 'Opptjeningstid',
                paragraf: <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>,
                oppfylt: true,
                komponent: <VilkårManglerData />,
            };
    }
};

const sykepengegrunnlag = (
    alderVedSkjæringstidspunkt: number,
    vilkår: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2,
): Vilkårdata => {
    const harEndretParagraf = alderVedSkjæringstidspunkt < 70 && alderVedSkjæringstidspunkt >= 67;
    switch (vilkår.__typename) {
        case 'VilkarsgrunnlagSpleisV2': {
            return {
                type: Vilkårstype.Sykepengegrunnlag,
                oppfylt: vilkår.oppfyllerKravOmMinstelonn,
                tittel: 'Krav til minste sykepengegrunnlag',
                paragraf: harEndretParagraf ? (
                    <EndretParagrafContainer />
                ) : (
                    <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
                ),
                komponent: (
                    <Sykepengegrunnlag
                        sykepengegrunnlag={vilkår.sykepengegrunnlag}
                        grunnbeløp={vilkår.grunnbelop}
                        alderVedSkjæringstidspunkt={alderVedSkjæringstidspunkt}
                    />
                ),
            };
        }
        case 'VilkarsgrunnlagInfotrygdV2': {
            return {
                type: Vilkårstype.Sykepengegrunnlag,
                tittel: 'Krav til minste sykepengegrunnlag',
                oppfylt: true,
                paragraf: <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>,
                komponent: <VilkårManglerData />,
            };
        }
    }
};

const medlemskap = (vilkårsgrunnlag: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2): Vilkårdata => {
    switch (vilkårsgrunnlag.__typename) {
        case 'VilkarsgrunnlagSpleisV2': {
            const vurdering = (vilkarsgrunnlagVurdering: VilkarsgrunnlagVurdering): boolean | null => {
                switch (vilkarsgrunnlagVurdering) {
                    case VilkarsgrunnlagVurdering.Oppfylt:
                        return true;
                    case VilkarsgrunnlagVurdering.IkkeOppfylt:
                        return false;
                    case VilkarsgrunnlagVurdering.IkkeVurdert:
                        return null;
                }
            };
            return {
                type: Vilkårstype.Medlemskap,
                oppfylt: vurdering(vilkårsgrunnlag.vurderingAvKravOmMedlemskap),
                tittel: 'Lovvalg og medlemskap',
                komponent: null,
            };
        }
        case 'VilkarsgrunnlagInfotrygdV2': {
            return {
                type: Vilkårstype.Medlemskap,
                oppfylt: true,
                tittel: 'Lovvalg og medlemskap',
                komponent: <VilkårManglerData />,
            };
        }
    }
};

export interface KategoriserteVilkår {
    oppfylteVilkår?: Vilkårdata[];
    ikkeOppfylteVilkår?: Vilkårdata[];
    ikkeVurderteVilkår?: Vilkårdata[];
    vilkårVurdertIInfotrygd?: Vilkårdata[];
    vilkårVurdertISpleis?: Vilkårdata[];
}

export const kategoriserteInngangsvilkår = (
    erSelvstendigNæring: boolean,
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2,
    alderVedSkjæringstidspunkt: number,
    vurdering?: Vurdering | null,
    spVilkårsvurdering?: SpVilkårsvurdering,
): KategoriserteVilkår => {
    const vurdertIInfotrygd = vilkårsgrunnlag.__typename === 'VilkarsgrunnlagInfotrygdV2';
    const vurdertISpleis = !vurdertIInfotrygd && vurdering;
    const ikkeVurdert = !vurdertIInfotrygd && !vurdertISpleis;

    const inngangsvilkår = [
        opptjeningstid(erSelvstendigNæring, vilkårsgrunnlag, spVilkårsvurdering),
        sykepengegrunnlag(alderVedSkjæringstidspunkt, vilkårsgrunnlag),
        medlemskap(vilkårsgrunnlag),
    ];

    return {
        oppfylteVilkår: ikkeVurdert ? inngangsvilkår.filter((it) => it.oppfylt) : [],
        ikkeOppfylteVilkår: ikkeVurdert ? inngangsvilkår.filter((it) => it.oppfylt === false) : [],
        ikkeVurderteVilkår: ikkeVurdert ? inngangsvilkår.filter((it) => it.oppfylt === null) : [],
        vilkårVurdertIInfotrygd: vurdertIInfotrygd ? inngangsvilkår : [],
        vilkårVurdertISpleis: vurdertISpleis ? inngangsvilkår : [],
    };
};
