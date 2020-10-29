import React, { ReactNode } from 'react';
import { Periodetype, Vedtaksperiode } from 'internal-types';
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
        {
            type: Vilkårstype.Alder,
            oppfylt: vilkår.alder.oppfylt,
            tittel: 'Under 70 år',
            paragraf: '§ 8-51',
            komponent: <Alder {...vilkår} />,
        },
        {
            type: Vilkårstype.Søknadsfrist,
            oppfylt: vilkår.søknadsfrist?.oppfylt,
            tittel: 'Søknadsfrist',
            paragraf: '§ 22-13',
            komponent: <Søknadsfrist {...vilkår} />,
        },
        {
            type: Vilkårstype.Opptjeningstid,
            oppfylt: vilkår.opptjening?.oppfylt,
            tittel: 'Opptjeningstid',
            paragraf: '§ 8-2',
            komponent: <Opptjeningstid {...vilkår} />,
        },
        {
            type: Vilkårstype.Sykepengegrunnlag,
            oppfylt: vilkår.sykepengegrunnlag.oppfylt,
            tittel: 'Krav til minste sykepengegrunnlag',
            paragraf: '§ 8-3',
            komponent: <Sykepengegrunnlag {...vilkår} />,
        },
        {
            type: Vilkårstype.DagerIgjen,
            oppfylt: vilkår.dagerIgjen.oppfylt,
            tittel: 'Dager igjen',
            paragraf: '§§ 8-11 og 8-12',
            komponent: <DagerIgjen {...vilkår} />,
        },
        {
            type: Vilkårstype.Medlemskap,
            oppfylt: vilkår.medlemskap?.oppfylt,
            tittel: 'Medlemskap',
            paragraf: '§ 2',
            komponent: null,
        },
        {
            type: Vilkårstype.Institusjonsopphold,
            oppfylt: godkjenttidspunkt?.isAfter(dayjs('10-04-2020')), //Ble lagt på sjekk i spleis 30/09/20
            tittel: 'Ingen institusjonsopphold',
            paragraf: '§ 8-53 og 8-54',
            komponent: null,
        },
        {
            type: Vilkårstype.Risikovurdering,
            oppfylt:
                risikovurdering &&
                !risikovurdering.ufullstendig &&
                risikovurdering.arbeidsuførhetvurdering.length === 0,
            tittel: 'Arbeidsuførhet, aktivitetsplikt og/eller medvirkning',
            paragraf: '§ 8-4 FØRSTE LEDD, § 8-4 ANDRE LEDD og § 8-8',
            komponent: <Risikovurdering risikovurdering={risikovurdering} />,
        },
    ];

    const vilkårVurdertAvSaksbehandler: Vilkårstype[] = [];
    const vilkårVurdertAutomatisk: Vilkårstype[] = [];
    const vilkårVurdertIInfotrygd: Vilkårstype[] = [];

    if (behandlet) {
        if (forlengelseFraInfotrygd) {
            vilkårVurdertIInfotrygd.push(Vilkårstype.Opptjeningstid, Vilkårstype.Sykepengegrunnlag);
            vilkårVurdertAvSaksbehandler.push(
                Vilkårstype.Arbeidsuførhet,
                Vilkårstype.Medlemskap,
                Vilkårstype.Medvirkning,
                Vilkårstype.Alder,
                Vilkårstype.Søknadsfrist,
                Vilkårstype.Institusjonsopphold,
                Vilkårstype.DagerIgjen
            );
        } else {
            if (automatiskBehandlet) {
                vilkårVurdertAutomatisk.push(
                    Vilkårstype.Arbeidsuførhet,
                    Vilkårstype.Medvirkning,
                    Vilkårstype.Alder,
                    Vilkårstype.Søknadsfrist,
                    Vilkårstype.Institusjonsopphold,
                    Vilkårstype.DagerIgjen
                );
            } else {
                vilkårVurdertAvSaksbehandler.push(
                    Vilkårstype.Arbeidsuførhet,
                    Vilkårstype.Medlemskap,
                    Vilkårstype.Medvirkning,
                    Vilkårstype.Alder,
                    Vilkårstype.Søknadsfrist,
                    Vilkårstype.Institusjonsopphold,
                    Vilkårstype.Opptjeningstid,
                    Vilkårstype.Sykepengegrunnlag,
                    Vilkårstype.DagerIgjen
                );
            }
        }
    } else {
        if (periodetype === Periodetype.Førstegangsbehandling) {
            // Ingen vilkår er vurdert fra før, med unntak av de som er markert som oppfylt fra spleis
        } else if (periodetype === Periodetype.Forlengelse) {
            vilkårVurdertAvSaksbehandler.push(
                Vilkårstype.Medlemskap,
                Vilkårstype.Institusjonsopphold,
                Vilkårstype.Opptjeningstid,
                Vilkårstype.Sykepengegrunnlag
            );
        } else if (periodetype === Periodetype.Infotrygdforlengelse) {
            vilkårVurdertIInfotrygd.push(Vilkårstype.Opptjeningstid, Vilkårstype.Sykepengegrunnlag);
        }
    }

    const alleVurderteVilkår = [
        ...vilkårVurdertIInfotrygd,
        ...vilkårVurdertAutomatisk,
        ...vilkårVurdertAvSaksbehandler,
    ];

    return {
        oppfylteVilkår: alleVilkår
            ?.filter(({ oppfylt }) => oppfylt)
            .filter(({ type }) => !alleVurderteVilkår.includes(type)),
        ikkeOppfylteVilkår: alleVilkår
            ?.filter(({ oppfylt }) => oppfylt !== undefined && !oppfylt)
            .filter(({ type }) => !alleVurderteVilkår.includes(type)),
        ikkeVurderteVilkår: alleVilkår
            ?.filter(({ oppfylt }) => oppfylt === undefined)
            .filter(({ type }) => !alleVurderteVilkår.includes(type)),
        vilkårVurdertAvSaksbehandler: alleVilkår?.filter(({ type }) => vilkårVurdertAvSaksbehandler.includes(type)),
        vilkårVurdertAutomatisk: alleVilkår?.filter(({ type }) => vilkårVurdertAutomatisk.includes(type)),
        vilkårVurdertIInfotrygd: alleVilkår?.filter(({ type }) => vilkårVurdertIInfotrygd.includes(type)),
    };
};
