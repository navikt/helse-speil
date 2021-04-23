import React from 'react';
import styled from '@emotion/styled';
import {
    Faresignal,
    Periodetype,
    Risikovurdering,
    Risikovurdering as RisikovurderingType,
    Vedtaksperiode,
    Vilkår,
} from 'internal-types';
import { Vilkårdata, Vilkårstype } from '../../../mapping/vilkår';
import {
    Alder,
    Arbeidsuførhet,
    DagerIgjen,
    Opptjeningstid,
    Sykepengegrunnlag,
    Søknadsfrist,
} from './vilkårsgrupper/Vilkårsgrupper';
import { Flex } from '../../../components/Flex';
import { Normaltekst } from 'nav-frontend-typografi';
import { Advarselikon } from '../../../components/ikoner/Advarselikon';
import { LovdataLenke } from '../../../components/LovdataLenke';

const VilkårManglerData = () => <Normaltekst>Mangler data om vilkåret</Normaltekst>;

const alder = (vilkår: Vilkår) => {
    const paragraf = vilkår.alder.alderSisteSykedag >= 67 ? '8-51' : '8-12';
    try {
        return {
            type: Vilkårstype.Alder,
            oppfylt: vilkår.alder.oppfylt,
            tittel: 'Under 70 år',
            paragraf: <LovdataLenke paragraf={paragraf}>§ {paragraf}</LovdataLenke>,
            komponent: <Alder data-testid="alder" {...vilkår} />,
        };
    } catch (error) {
        return {
            type: Vilkårstype.Alder,
            tittel: 'Under 70 år',
            paragraf: <LovdataLenke paragraf={paragraf}>§ {paragraf}</LovdataLenke>,
            komponent: <VilkårManglerData />,
        };
    }
};

const søknadsfrist = (vilkår: Vilkår) => {
    try {
        return {
            type: Vilkårstype.Søknadsfrist,
            oppfylt: vilkår.søknadsfrist?.oppfylt,
            tittel: 'Søknadsfrist',
            paragraf: <LovdataLenke paragraf="22-13">§ 22-13</LovdataLenke>,
            komponent: <Søknadsfrist data-testid="søknadsfrist" {...vilkår} />,
        };
    } catch (error) {
        return {
            type: Vilkårstype.Søknadsfrist,
            tittel: 'Søknadsfrist',
            paragraf: <LovdataLenke paragraf="22-13">§ 22-13</LovdataLenke>,
            komponent: <VilkårManglerData />,
        };
    }
};

const opptjeningstid = (vilkår: Vilkår) => {
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

const AlderIkon = styled(Advarselikon)`
    padding: 0 10px 0 2px;
`;

const EndretParagrafContainer = Flex.withComponent('span');

const sykepengegrunnlag = (vilkår: Vilkår) => {
    try {
        const harEndretParagraf = vilkår.alder.alderSisteSykedag < 70 && vilkår.alder.alderSisteSykedag >= 67;
        return {
            type: Vilkårstype.Sykepengegrunnlag,
            oppfylt: vilkår.sykepengegrunnlag.oppfylt,
            tittel: 'Krav til minste sykepengegrunnlag',
            paragraf: harEndretParagraf ? (
                <EndretParagrafContainer style={{ alignItems: 'center' }}>
                    <AlderIkon width={16} height={16} />
                    <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                </EndretParagrafContainer>
            ) : (
                <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
            ),
            komponent: <Sykepengegrunnlag {...vilkår} />,
        };
    } catch (error) {
        return {
            type: Vilkårstype.Sykepengegrunnlag,
            tittel: 'Krav til minste sykepengegrunnlag',
            paragraf: <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>,
            komponent: <VilkårManglerData />,
        };
    }
};

const dagerIgjen = (vilkår: Vilkår) => {
    try {
        return {
            type: Vilkårstype.DagerIgjen,
            oppfylt: vilkår.dagerIgjen.oppfylt,
            tittel: 'Dager igjen',
            paragraf: (
                <>
                    §§&nbsp;<LovdataLenke paragraf="8-11">8-11</LovdataLenke>&nbsp;og&nbsp;
                    <LovdataLenke paragraf="8-12">8-12</LovdataLenke>
                </>
            ),
            komponent: <DagerIgjen {...vilkår} />,
        };
    } catch (error) {
        return {
            type: Vilkårstype.DagerIgjen,
            tittel: 'Dager igjen',
            paragraf: (
                <>
                    §§&nbsp;<LovdataLenke paragraf="8-11">8-11</LovdataLenke>&nbsp;og&nbsp;
                    <LovdataLenke paragraf="8-12">8-12</LovdataLenke>
                </>
            ),
            komponent: <VilkårManglerData />,
        };
    }
};

const medlemskap = (vilkår: Vilkår) => {
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

const institusjonsopphold = (oppfylt?: boolean) => ({
    type: Vilkårstype.Institusjonsopphold,
    oppfylt: oppfylt,
    tittel: 'Institusjonsopphold',
    paragraf: (
        <>
            §§&nbsp;<LovdataLenke paragraf="8-53">8-53</LovdataLenke>&nbsp;og&nbsp;
            <LovdataLenke paragraf="8-54">8-54</LovdataLenke>
        </>
    ),
    komponent: null,
});

const er8_4 = (funn: string) => funn === '8-4';
export const har8_4Kategori = (funn: Faresignal) => funn.kategori.find(er8_4);

const arbeidsuførhet = (risikovurdering?: RisikovurderingType) => {
    try {
        const oppfylt = (risikovurdering && risikovurdering.funn.filter(har8_4Kategori).length === 0) || undefined;
        return {
            type: Vilkårstype.Arbeidsuførhet,
            oppfylt: oppfylt,
            tittel: 'Arbeidsuførhet, aktivitetsplikt og medvirkning',
            paragraf: (
                <>
                    <LovdataLenke paragraf="8-4">§ 8-4 FØRSTE LEDD, § 8-4 ANDRE LEDD </LovdataLenke>&nbsp;og&nbsp;
                    <LovdataLenke paragraf="8-8">§ 8-8</LovdataLenke>
                </>
            ),
            komponent: <Arbeidsuførhet risikovurdering={risikovurdering} />,
        };
    } catch (error) {
        return {
            type: Vilkårstype.Arbeidsuførhet,
            tittel: 'Arbeidsuførhet, aktivitetsplikt og medvirkning',
            paragraf: (
                <>
                    <LovdataLenke paragraf="8-4">§ 8-4 FØRSTE LEDD, § 8-4 ANDRE LEDD </LovdataLenke>&nbsp;og&nbsp;
                    <LovdataLenke paragraf="8-8">§ 8-8</LovdataLenke>
                </>
            ),
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

export const tilKategoriserteVilkår = ({
    vilkår,
    risikovurdering,
    periodetype,
    behandlet,
    forlengelseFraInfotrygd,
    automatiskBehandlet,
}: Vedtaksperiode): KategoriserteVilkår => {
    const alleVilkår: Vilkårdata[] | undefined = vilkår && [
        alder(vilkår),
        søknadsfrist(vilkår),
        opptjeningstid(vilkår),
        sykepengegrunnlag(vilkår),
        dagerIgjen(vilkår),
        medlemskap(vilkår),
        institusjonsopphold(true),
        arbeidsuførhet(risikovurdering),
    ];

    const vilkårstyperVurdertIInfotrygd: Vilkårstype[] = [];
    const vilkårstyperVurdertAvSaksbehandler: Vilkårstype[] = [];
    const vilkårstyperVurdertAutomatisk: Vilkårstype[] = [];
    const vilkårstyperVurdertFørstePeriode: Vilkårstype[] = [];

    if (behandlet) {
        if (forlengelseFraInfotrygd) {
            const vilkårIkkeVurdertIInfotrygd = [
                Vilkårstype.Arbeidsuførhet,
                Vilkårstype.Alder,
                Vilkårstype.Søknadsfrist,
                Vilkårstype.Institusjonsopphold,
                Vilkårstype.DagerIgjen,
            ];
            vilkårstyperVurdertIInfotrygd.push(
                Vilkårstype.Opptjeningstid,
                Vilkårstype.Sykepengegrunnlag,
                Vilkårstype.Medlemskap
            );
            if (automatiskBehandlet) {
                vilkårstyperVurdertAutomatisk.push(...vilkårIkkeVurdertIInfotrygd);
            } else {
                vilkårstyperVurdertAvSaksbehandler.push(...vilkårIkkeVurdertIInfotrygd);
            }
        } else if (periodetype === Periodetype.Forlengelse) {
            const vurderteVilkårDennePerioden = [
                Vilkårstype.Arbeidsuførhet,
                Vilkårstype.Alder,
                Vilkårstype.Søknadsfrist,
                Vilkårstype.Institusjonsopphold,
                Vilkårstype.DagerIgjen,
            ];
            if (automatiskBehandlet) {
                vilkårstyperVurdertAutomatisk.push(...vurderteVilkårDennePerioden);
            } else {
                vilkårstyperVurdertAvSaksbehandler.push(...vurderteVilkårDennePerioden);
            }
            vilkårstyperVurdertFørstePeriode.push(
                Vilkårstype.Opptjeningstid,
                Vilkårstype.Sykepengegrunnlag,
                Vilkårstype.Medlemskap
            );
        } else {
            const vurderteVilkår = [
                Vilkårstype.Arbeidsuførhet,
                Vilkårstype.Medlemskap,
                Vilkårstype.Medvirkning,
                Vilkårstype.Alder,
                Vilkårstype.Søknadsfrist,
                Vilkårstype.Institusjonsopphold,
                Vilkårstype.Opptjeningstid,
                Vilkårstype.Sykepengegrunnlag,
                Vilkårstype.DagerIgjen,
            ];
            if (automatiskBehandlet) {
                vilkårstyperVurdertAutomatisk.push(...vurderteVilkår);
            } else {
                vilkårstyperVurdertAvSaksbehandler.push(...vurderteVilkår);
            }
        }
    } else {
        const tidligereVurderteVilkår = [
            Vilkårstype.Medlemskap,
            Vilkårstype.Opptjeningstid,
            Vilkårstype.Sykepengegrunnlag,
        ];
        if (periodetype === Periodetype.Forlengelse) {
            vilkårstyperVurdertFørstePeriode.push(...tidligereVurderteVilkår);
        } else if (periodetype === Periodetype.Infotrygdforlengelse) {
            vilkårstyperVurdertIInfotrygd.push(...tidligereVurderteVilkår);
        }
    }

    const vilkårVurdertAvSaksbehandler: Vilkårdata[] =
        alleVilkår?.filter(({ type }) => vilkårstyperVurdertAvSaksbehandler?.includes(type)) ?? [];

    const vilkårVurdertAutomatisk: Vilkårdata[] =
        alleVilkår?.filter(({ type }) => vilkårstyperVurdertAutomatisk?.includes(type)) ?? [];

    const vilkårVurdertIInfotrygd: Vilkårdata[] =
        alleVilkår?.filter(({ type }) => vilkårstyperVurdertIInfotrygd?.includes(type)) ?? [];

    const vilkårVurdertFørstePeriode: Vilkårdata[] =
        alleVilkår?.filter(({ type }) => vilkårstyperVurdertFørstePeriode?.includes(type)) ?? [];

    const alleVurderteVilkår = [
        ...vilkårVurdertAutomatisk,
        ...vilkårVurdertIInfotrygd,
        ...vilkårVurdertAvSaksbehandler,
        ...vilkårVurdertFørstePeriode,
    ];

    const alleredeVurderteVilkår = ({ type }: Vilkårdata) =>
        !alleVurderteVilkår.find(({ type: vurdertType }) => vurdertType === type);

    return {
        oppfylteVilkår: alleVilkår?.filter(({ oppfylt }) => oppfylt).filter(alleredeVurderteVilkår),
        ikkeOppfylteVilkår: alleVilkår?.filter(({ oppfylt }) => oppfylt === false).filter(alleredeVurderteVilkår),
        ikkeVurderteVilkår: alleVilkår?.filter(({ oppfylt }) => oppfylt === undefined).filter(alleredeVurderteVilkår),
        vilkårVurdertAvSaksbehandler: vilkårVurdertAvSaksbehandler,
        vilkårVurdertAutomatisk: vilkårVurdertAutomatisk,
        vilkårVurdertIInfotrygd: vilkårVurdertIInfotrygd,
        vilkårVurdertFørstePeriode: vilkårVurdertFørstePeriode,
    };
};
