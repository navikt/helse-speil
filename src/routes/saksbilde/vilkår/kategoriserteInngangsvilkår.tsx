import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import { VilkarsgrunnlagInfotrygdV2, VilkarsgrunnlagSpleisV2, VilkarsgrunnlagVurdering, Vurdering } from '@io/graphql';
import { DateString } from '@typer/shared';
import { Vilkårdata, Vilkårstype } from '@typer/vilkår';

import { EndretParagrafContainer } from './EndretParagrafContainer';
import { Opptjeningstid, Sykepengegrunnlag } from './vilkårsgrupper/Vilkårsgrupper';

const VilkårManglerData = (): ReactElement => <BodyShort>Mangler data om vilkåret</BodyShort>;

const opptjeningstid = (
    skjæringstidspunkt: DateString,
    vilkår: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2,
): Vilkårdata => {
    switch (vilkår.__typename) {
        case 'VilkarsgrunnlagSpleisV2': {
            return {
                type: Vilkårstype.Opptjeningstid,
                oppfylt: vilkår.oppfyllerKravOmOpptjening,
                tittel: 'Opptjeningstid',
                paragraf: <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>,
                komponent: (
                    <Opptjeningstid
                        skjæringstidspunkt={skjæringstidspunkt}
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
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2,
    alderVedSkjæringstidspunkt: number,
    vurdering?: Vurdering | null,
): KategoriserteVilkår => {
    const vurdertIInfotrygd = vilkårsgrunnlag.__typename === 'VilkarsgrunnlagInfotrygdV2';
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
