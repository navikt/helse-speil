import { Vilkårdata, Vilkårstype } from '../../../mapping/vilkår';
import { Opptjeningstid, Sykepengegrunnlag } from './vilkårsgrupper/Vilkårsgrupper';
import styled from '@emotion/styled';
import React from 'react';

import { BodyShort, Tooltip } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { LovdataLenke } from '@components/LovdataLenke';
import { Advarselikon } from '@components/ikoner/Advarselikon';
import { Vilkarsgrunnlag, VilkarsgrunnlagSpleis, Vurdering } from '@io/graphql';

const VilkårManglerData = () => <BodyShort>Mangler data om vilkåret</BodyShort>;

const opptjeningstid = (skjæringstidspunkt: DateString, vilkår: Vilkarsgrunnlag): Vilkårdata => {
    switch (vilkår.vilkarsgrunnlagtype) {
        case 'SPLEIS': {
            const spleisVilkår = vilkår as VilkarsgrunnlagSpleis;
            return {
                type: Vilkårstype.Opptjeningstid,
                oppfylt: spleisVilkår.oppfyllerKravOmOpptjening,
                tittel: 'Opptjeningstid',
                paragraf: <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>,
                komponent: (
                    <Opptjeningstid
                        skjæringstidspunkt={skjæringstidspunkt}
                        opptjeningFra={spleisVilkår.opptjeningFra}
                        antallOpptjeningsdagerErMinst={spleisVilkår.antallOpptjeningsdagerErMinst}
                    />
                ),
            };
        }
        case 'INFOTRYGD':
        case 'UKJENT':
        default:
            return {
                type: Vilkårstype.Opptjeningstid,
                tittel: 'Opptjeningstid',
                paragraf: <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>,
                oppfylt: true,
                komponent: <VilkårManglerData />,
            };
    }
};

const EndretParagrafContainer = Flex.withComponent('span');

const IconContainer = styled.div`
    justify-self: center;
`;

const LovdataLenkeContainer = styled(BodyShort)`
    font-size: 14px;
    margin-left: 0.5rem;
`;

const sykepengegrunnlag = (alderVedSkjæringstidspunkt: number, vilkår: Vilkarsgrunnlag): Vilkårdata => {
    const harEndretParagraf = alderVedSkjæringstidspunkt < 70 && alderVedSkjæringstidspunkt >= 67;
    switch (vilkår.vilkarsgrunnlagtype) {
        case 'SPLEIS': {
            const spleisVilkår = vilkår as VilkarsgrunnlagSpleis;
            return {
                type: Vilkårstype.Sykepengegrunnlag,
                oppfylt: spleisVilkår.oppfyllerKravOmMinstelonn,
                tittel: 'Krav til minste sykepengegrunnlag',
                paragraf: harEndretParagraf ? (
                    <EndretParagrafContainer alignItems="center">
                        <Tooltip content="Mellom 67 og 70 år - inntektsgrunnlaget må overstige 2G">
                            <IconContainer>
                                <Advarselikon
                                    alt="Mellom 67 og 70 år - inntektsgrunnlaget må overstige 2G"
                                    height={16}
                                    width={16}
                                />
                            </IconContainer>
                        </Tooltip>
                        <LovdataLenkeContainer as="p">
                            <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                        </LovdataLenkeContainer>
                    </EndretParagrafContainer>
                ) : (
                    <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
                ),
                komponent: (
                    <Sykepengegrunnlag
                        sykepengegrunnlag={spleisVilkår.sykepengegrunnlag}
                        grunnbeløp={spleisVilkår.grunnbelop}
                        alderVedSkjæringstidspunkt={alderVedSkjæringstidspunkt}
                    />
                ),
            };
        }
        case 'INFOTRYGD':
        case 'UKJENT':
        default: {
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

const medlemskap = (vilkårsgrunnlag: Vilkarsgrunnlag): Vilkårdata => {
    switch (vilkårsgrunnlag.vilkarsgrunnlagtype) {
        case 'SPLEIS': {
            return {
                type: Vilkårstype.Medlemskap,
                oppfylt: (vilkårsgrunnlag as VilkarsgrunnlagSpleis).oppfyllerKravOmMedlemskap ?? null,
                tittel: 'Lovvalg og medlemskap',
                komponent: null,
            };
        }
        case 'INFOTRYGD':
        case 'UKJENT':
        default: {
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
    vilkårsgrunnlag: Vilkarsgrunnlag,
    alderVedSkjæringstidspunkt: number,
    vurdering?: Vurdering | null
): KategoriserteVilkår => {
    const vurdertIInfotrygd = vilkårsgrunnlag.vilkarsgrunnlagtype === 'INFOTRYGD';
    const vurdertISpleis = !vurdertIInfotrygd && vurdering;
    const ikkeVurdert = !vurdertIInfotrygd && !vurdertISpleis;

    const inngangsvilkår = [
        opptjeningstid(vilkårsgrunnlag.skjaeringstidspunkt, vilkårsgrunnlag),
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
