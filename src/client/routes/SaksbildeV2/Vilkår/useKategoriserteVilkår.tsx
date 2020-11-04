import React from 'react';
import styled from '@emotion/styled';
import { Periodetype, Risikovurdering as RisikovurderingType, Vedtaksperiode, Vilkår } from 'internal-types';
import { Vilkårdata, Vilkårstype } from '../../../mapping/vilkår';
import {
    Alder,
    DagerIgjen,
    Medlemskap,
    Opptjeningstid,
    Risikovurdering,
    Sykepengegrunnlag,
    Søknadsfrist,
} from './vilkårsgrupper/Vilkårsgrupper';
import dayjs from 'dayjs';
import { Advarselikon } from '../../../components/ikoner/Advarselikon';

const alder = (vilkår: Vilkår) => ({
    type: Vilkårstype.Alder,
    oppfylt: vilkår.alder.oppfylt,
    tittel: 'Under 70 år',
    paragraf: '§ 8-51',
    komponent: <Alder {...vilkår} />,
});

const søknadsfrist = (vilkår: Vilkår) => ({
    type: Vilkårstype.Søknadsfrist,
    oppfylt: vilkår.søknadsfrist?.oppfylt,
    tittel: 'Søknadsfrist',
    paragraf: '§ 22-13',
    komponent: <Søknadsfrist {...vilkår} />,
});

const opptjeningstid = (vilkår: Vilkår) => ({
    type: Vilkårstype.Opptjeningstid,
    oppfylt: vilkår.opptjening?.oppfylt,
    tittel: 'Opptjeningstid',
    paragraf: '§ 8-2',
    komponent: <Opptjeningstid {...vilkår} />,
});

const AdvarselikonAlder = styled(Advarselikon)`
    padding: 0 10px 0 2px;
`;

const sykepengegrunnlag = (vilkår: Vilkår) => ({
    type: Vilkårstype.Sykepengegrunnlag,
    oppfylt: vilkår.sykepengegrunnlag.oppfylt,
    tittel: 'Krav til minste sykepengegrunnlag',
    paragraf: vilkår.alder.alderSisteSykedag < 70 && vilkår.alder.alderSisteSykedag >= 67 ? '§ 8-51' : '§ 8-3',
    paragrafIkon:
        vilkår.alder.alderSisteSykedag < 70 && vilkår.alder.alderSisteSykedag >= 67 ? (
            <AdvarselikonAlder width={16} height={16} />
        ) : null,
    komponent: <Sykepengegrunnlag {...vilkår} />,
});

const dagerIgjen = (vilkår: Vilkår) => ({
    type: Vilkårstype.DagerIgjen,
    oppfylt: vilkår.dagerIgjen.oppfylt,
    tittel: 'Dager igjen',
    paragraf: '§§ 8-11 og 8-12',
    komponent: <DagerIgjen {...vilkår} />,
});

const medlemskap = (vilkår: Vilkår) => ({
    type: Vilkårstype.Medlemskap,
    oppfylt: vilkår.medlemskap?.oppfylt,
    tittel: 'Medlemskap',
    paragraf: '§ 2',
    komponent: null,
});

const institusjonsopphold = (oppfylt?: boolean) => ({
    type: Vilkårstype.Institusjonsopphold,
    oppfylt: oppfylt,
    tittel: 'Ingen institusjonsopphold',
    paragraf: '§ 8-53 og 8-54',
    komponent: null,
});

const risikovurderingsvilkår = (risikovurdering?: RisikovurderingType) => ({
    type: Vilkårstype.Risikovurdering,
    oppfylt: risikovurdering && !risikovurdering.ufullstendig && risikovurdering.arbeidsuførhetvurdering.length === 0,
    tittel: 'Arbeidsuførhet, aktivitetsplikt og medvirkning',
    paragraf: '§ 8-4 FØRSTE LEDD, § 8-4 ANDRE LEDD og § 8-8',
    komponent: <Risikovurdering risikovurdering={risikovurdering} />,
});

export interface KategoriserteVilkår {
    oppfylteVilkår?: Vilkårdata[];
    ikkeOppfylteVilkår?: Vilkårdata[];
    ikkeVurderteVilkår?: Vilkårdata[];
    vilkårVurdertAvSaksbehandler?: Vilkårdata[];
    vilkårVurdertAutomatisk?: Vilkårdata[];
    vilkårVurdertIInfotrygd?: Vilkårdata[];
}

export const useKategoriserteVilkår = ({
    vilkår,
    risikovurdering,
    periodetype,
    behandlet,
    forlengelseFraInfotrygd,
    automatiskBehandlet,
    godkjenttidspunkt,
}: Vedtaksperiode): KategoriserteVilkår => {
    const alleVilkår: Vilkårdata[] | undefined = vilkår && [
        alder(vilkår),
        søknadsfrist(vilkår),
        opptjeningstid(vilkår),
        sykepengegrunnlag(vilkår),
        dagerIgjen(vilkår),
        medlemskap(vilkår),
        institusjonsopphold(godkjenttidspunkt?.isAfter(dayjs('10-04-2020'))), //Ble lagt på sjekk i spleis 30/09/20
        risikovurderingsvilkår(risikovurdering),
    ];

    const vilkårstyperVurdertIInfotrygd: Vilkårstype[] = [];
    const vilkårstyperVurdertAvSaksbehandler: Vilkårstype[] = [];
    const vilkårstyperVurdertAutomatisk: Vilkårstype[] = [];

    if (behandlet) {
        if (forlengelseFraInfotrygd && automatiskBehandlet) {
            vilkårstyperVurdertIInfotrygd.push(Vilkårstype.Opptjeningstid, Vilkårstype.Sykepengegrunnlag);
            vilkårstyperVurdertAutomatisk.push(
                Vilkårstype.Arbeidsuførhet,
                Vilkårstype.Medvirkning,
                Vilkårstype.Alder,
                Vilkårstype.Søknadsfrist,
                Vilkårstype.Institusjonsopphold,
                Vilkårstype.DagerIgjen
            );
        } else if (forlengelseFraInfotrygd) {
            vilkårstyperVurdertIInfotrygd.push(Vilkårstype.Opptjeningstid, Vilkårstype.Sykepengegrunnlag);
            vilkårstyperVurdertAvSaksbehandler.push(
                Vilkårstype.Arbeidsuførhet,
                Vilkårstype.Medlemskap,
                Vilkårstype.Medvirkning,
                Vilkårstype.Alder,
                Vilkårstype.Søknadsfrist,
                Vilkårstype.Institusjonsopphold,
                Vilkårstype.DagerIgjen,
                Vilkårstype.Risikovurdering
            );
        } else if (automatiskBehandlet) {
            vilkårstyperVurdertAutomatisk.push(
                Vilkårstype.Arbeidsuførhet,
                Vilkårstype.Medvirkning,
                Vilkårstype.Alder,
                Vilkårstype.Søknadsfrist,
                Vilkårstype.Institusjonsopphold,
                Vilkårstype.DagerIgjen
            );
        } else {
            vilkårstyperVurdertAvSaksbehandler.push(
                Vilkårstype.Arbeidsuførhet,
                Vilkårstype.Medlemskap,
                Vilkårstype.Medvirkning,
                Vilkårstype.Alder,
                Vilkårstype.Søknadsfrist,
                Vilkårstype.Institusjonsopphold,
                Vilkårstype.Opptjeningstid,
                Vilkårstype.Sykepengegrunnlag,
                Vilkårstype.DagerIgjen,
                Vilkårstype.Risikovurdering
            );
        }
    } else {
        if (periodetype === Periodetype.Forlengelse) {
            vilkårstyperVurdertAvSaksbehandler.push(
                Vilkårstype.Medlemskap,
                Vilkårstype.Institusjonsopphold,
                Vilkårstype.Opptjeningstid,
                Vilkårstype.Sykepengegrunnlag
            );
        } else if (periodetype === Periodetype.Infotrygdforlengelse) {
            vilkårstyperVurdertIInfotrygd.push(Vilkårstype.Opptjeningstid, Vilkårstype.Sykepengegrunnlag);
        }
    }

    const alleVurderteVilkårstyper = [
        ...vilkårstyperVurdertIInfotrygd,
        ...vilkårstyperVurdertAutomatisk,
        ...vilkårstyperVurdertAvSaksbehandler,
    ];

    const alleredeVurderteVilkår = ({ type }: Vilkårdata) => !alleVurderteVilkårstyper.includes(type);

    return {
        oppfylteVilkår: alleVilkår?.filter(({ oppfylt }) => oppfylt).filter(alleredeVurderteVilkår),
        ikkeOppfylteVilkår: alleVilkår?.filter(({ oppfylt }) => oppfylt === false).filter(alleredeVurderteVilkår),
        ikkeVurderteVilkår: alleVilkår?.filter(({ oppfylt }) => oppfylt === undefined).filter(alleredeVurderteVilkår),
        vilkårVurdertAvSaksbehandler: alleVilkår?.filter(({ type }) =>
            vilkårstyperVurdertAvSaksbehandler.includes(type)
        ),
        vilkårVurdertAutomatisk: alleVilkår?.filter(({ type }) => vilkårstyperVurdertAutomatisk.includes(type)),
        vilkårVurdertIInfotrygd: alleVilkår?.filter(({ type }) => vilkårstyperVurdertIInfotrygd.includes(type)),
    };
};
