import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Flex } from '../../../components/Flex';
import { LovdataLenke } from '../../../components/LovdataLenke';
import { Advarselikon } from '../../../components/ikoner/Advarselikon';
import { Vilkårdata, Vilkårstype } from '../../../mapping/vilkår';

import { Opptjeningstid, Sykepengegrunnlag } from './vilkårsgrupper/Vilkårsgrupper';

const VilkårManglerData = () => <BodyShort>Mangler data om vilkåret</BodyShort>;

const opptjeningstid = (vilkår: Vilkår): Vilkårdata => {
    try {
        return {
            type: Vilkårstype.Opptjeningstid,
            oppfylt: vilkår.opptjening?.oppfylt,
            tittel: 'Opptjeningstid',
            paragraf: <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>,
            komponent: <Opptjeningstid {...vilkår} />,
        };
    } catch (error) {
        return {
            type: Vilkårstype.Opptjeningstid,
            tittel: 'Opptjeningstid',
            paragraf: <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>,
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

const sykepengegrunnlag = (vilkår: Vilkår): Vilkårdata => {
    try {
        const harEndretParagraf = vilkår.alder.alderSisteSykedag < 70 && vilkår.alder.alderSisteSykedag >= 67;
        return {
            type: Vilkårstype.Sykepengegrunnlag,
            oppfylt: vilkår.sykepengegrunnlag.oppfylt,
            tittel: 'Krav til minste sykepengegrunnlag',
            paragraf: harEndretParagraf ? (
                <EndretParagrafContainer alignItems="center">
                    <IconContainer data-tip="Mellom 62 og 70 år - redusert antall sykepengedager">
                        <Advarselikon
                            alt="Mellom 62 og 70 år - redusert antall sykepengedager"
                            height={16}
                            width={16}
                        />
                    </IconContainer>
                    <LovdataLenkeContainer component="p">
                        <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                    </LovdataLenkeContainer>
                </EndretParagrafContainer>
            ) : (
                <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
            ),
            komponent: <Sykepengegrunnlag {...vilkår} />,
        };
    } catch (_) {
        return {
            type: Vilkårstype.Sykepengegrunnlag,
            tittel: 'Krav til minste sykepengegrunnlag',
            paragraf: <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>,
            komponent: <VilkårManglerData />,
        };
    }
};

const medlemskap = (vilkår: Vilkår): Vilkårdata => {
    try {
        return {
            type: Vilkårstype.Medlemskap,
            oppfylt: vilkår.medlemskap?.oppfylt,
            tittel: 'Lovvalg og medlemskap',
            komponent: null,
        };
    } catch (error) {
        return {
            type: Vilkårstype.Medlemskap,
            tittel: 'Lovvalg og medlemskap',
            komponent: <VilkårManglerData />,
        };
    }
};

export interface KategoriserteVilkår {
    oppfylteVilkår?: Vilkårdata[];
    ikkeOppfylteVilkår?: Vilkårdata[];
    ikkeVurderteVilkår?: Vilkårdata[];
    vilkårVurdertAvSaksbehandler?: Vilkårdata[];
    vilkårVurdertAutomatisk?: Vilkårdata[];
    vilkårVurdertIInfotrygd?: Vilkårdata[];
    vilkårVurdertFørstePeriode?: Vilkårdata[];
}

export const kategoriserteInngangsvilkår = ({
    vilkår,
    behandlet,
    periodetype,
    automatiskBehandlet,
    forlengelseFraInfotrygd,
}: Vedtaksperiode): KategoriserteVilkår => {
    if (!vilkår) return {};

    const vurdertIInfotrygd = forlengelseFraInfotrygd || periodetype === 'infotrygdforlengelse';
    const vurdertAutomatisk = !vurdertIInfotrygd && behandlet && automatiskBehandlet;
    const vurdertFørstePeriode = !vurdertIInfotrygd && !behandlet && periodetype === 'forlengelse';
    const vurdertAvSaksbehandler = !vurdertIInfotrygd && behandlet && !automatiskBehandlet;
    const ikkeVurdert = !vurdertIInfotrygd && !vurdertAutomatisk && !vurdertFørstePeriode && !vurdertAvSaksbehandler;

    const inngangsvilkår = [opptjeningstid(vilkår), sykepengegrunnlag(vilkår), medlemskap(vilkår)];

    return {
        oppfylteVilkår: ikkeVurdert ? inngangsvilkår.filter((it) => it.oppfylt) : [],
        ikkeOppfylteVilkår: ikkeVurdert ? inngangsvilkår.filter((it) => it.oppfylt === false) : [],
        ikkeVurderteVilkår: ikkeVurdert ? inngangsvilkår.filter((it) => it.oppfylt === undefined) : [],
        vilkårVurdertAvSaksbehandler: vurdertAvSaksbehandler ? inngangsvilkår : [],
        vilkårVurdertAutomatisk: vurdertAutomatisk ? inngangsvilkår : [],
        vilkårVurdertIInfotrygd: vurdertIInfotrygd ? inngangsvilkår : [],
        vilkårVurdertFørstePeriode: vurdertFørstePeriode ? inngangsvilkår : [],
    };
};
