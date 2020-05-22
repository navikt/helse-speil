import React, { ReactNode, useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { PersonContext } from '../../context/PersonContext';
import styled from '@emotion/styled';
import BehandletVedtaksperiode from './BehandletVedtaksperiode';
import PåfølgendeVedtaksperiode from './PåfølgendeVedtaksperiode';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';
import Aktivitetsplikt from './Aktivitetsplikt';
import { mapVilkår, Vilkårstype, VurdertVilkår } from '../../context/mapping/vilkårsmapper';
import UbehandletVedtaksperiode from './UbehandletVedtaksperiode';
import { IkkeVurdertVilkår } from './Vilkårsgrupper/IkkeVurderteVilkår';
import {
    alder,
    dagerIgjen,
    kravTilSykepengegrunnlag,
    opptjeningstid,
    søknadsfrist
} from './Vilkårsgrupper/Vilkårsgrupper';
import { Opptjening } from '../../context/types.internal';

const Footer = styled(NavigationButtons)`
    margin: 2.5rem 2rem 2rem;
`;

export interface Vilkårdata {
    oppfylt: boolean;
    type: Vilkårstype;
    komponent: ReactNode;
}

const filtrerBehandledeVilkår = (vilkår: Vilkårdata): boolean =>
    ![Vilkårstype.Opptjeningstid, Vilkårstype.KravTilSykepengegrunnlag].includes(vilkår.type);

const tilKomponent = (vilkår: Vilkårdata): ReactNode => vilkår.komponent;

const Vilkår = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const periodeStatus = useVedtaksperiodestatus();

    if (!aktivVedtaksperiode?.vilkår || personTilBehandling === undefined) return null;
    const { vilkår } = aktivVedtaksperiode;

    const tilVilkårsgruppe = (vurdertVilkår: VurdertVilkår): ReactNode => {
        switch (vurdertVilkår.vilkår) {
            case Vilkårstype.Alder:
                return alder(vilkår.alder);
            case Vilkårstype.Søknadsfrist:
                return vilkår.søknadsfrist !== undefined ? søknadsfrist(vilkår.søknadsfrist) : undefined;
            case Vilkårstype.Opptjeningstid:
                return vilkår.opptjening
                    ? opptjeningstid(vilkår.opptjening as Opptjening, vilkår.dagerIgjen.førsteFraværsdag)
                    : undefined;
            case Vilkårstype.KravTilSykepengegrunnlag:
                return kravTilSykepengegrunnlag(vilkår.sykepengegrunnlag!, vilkår.alder.alderSisteSykedag);
            case Vilkårstype.DagerIgjen:
                return vilkår.dagerIgjen !== undefined ? dagerIgjen(vilkår.dagerIgjen) : undefined;
        }
    };

    const vurderteVilkår: Vilkårdata[] = mapVilkår(vilkår).map(vilkår => ({
        type: vilkår.vilkår,
        komponent: tilVilkårsgruppe(vilkår),
        oppfylt: vilkår.oppfylt
    }));

    const førsteVedtaksperiode = finnFørsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling!);

    const ikkeOppfylteVilkår: Vilkårdata[] = vurderteVilkår.filter(it => !it.oppfylt);
    const oppfylteVilkår: Vilkårdata[] = vurderteVilkår.filter(it => it.oppfylt);
    const ikkeVurderteVilkår: IkkeVurdertVilkår[] = vurderteVilkår
        .filter(it => it.oppfylt == undefined)
        .map(it => {
            switch (it.type) {
                case Vilkårstype.Alder:
                    return { label: 'Under 70 år', paragraf: '§8-51' };
                case Vilkårstype.Søknadsfrist:
                    return { label: 'Søknadsfrist', paragraf: '§22-13' };
                case Vilkårstype.Opptjeningstid:
                    return { label: 'Opptjening', paragraf: '§8-2' };
                case Vilkårstype.KravTilSykepengegrunnlag:
                    return { label: 'Krav til minste sykepengegrunnlag', paragraf: '§8-3' };
                case Vilkårstype.DagerIgjen:
                    return { label: 'Dager igjen', paragraf: '§8-11 og §8-12' };
            }
        });

    const vedtaksperiodevisning = (periodestatus: VedtaksperiodeStatus): ReactNode => {
        switch (periodestatus) {
            case VedtaksperiodeStatus.Behandlet:
                return (
                    <BehandletVedtaksperiode
                        aktivVedtaksperiode={aktivVedtaksperiode}
                        førsteVedtaksperiode={førsteVedtaksperiode}
                    />
                );
            case VedtaksperiodeStatus.Ubehandlet:
                return (
                    <UbehandletVedtaksperiode
                        ikkeOppfylteVilkår={ikkeOppfylteVilkår.map(tilKomponent)}
                        oppfylteVilkår={oppfylteVilkår.map(tilKomponent)}
                        ikkeVurderteVilkår={ikkeVurderteVilkår}
                    />
                );
            case VedtaksperiodeStatus.Påfølgende:
                return (
                    <PåfølgendeVedtaksperiode
                        førsteVedtaksperiode={førsteVedtaksperiode}
                        ikkeOppfylteVilkår={ikkeOppfylteVilkår.filter(filtrerBehandledeVilkår).map(tilKomponent)}
                        oppfylteVilkår={oppfylteVilkår.filter(filtrerBehandledeVilkår).map(tilKomponent)}
                        ikkeVurderteVilkår={ikkeVurderteVilkår}
                        forlengelseFraInfotrygd={aktivVedtaksperiode?.forlengelseFraInfotrygd}
                    />
                );
        }
    };

    return (
        <>
            {periodeStatus && vedtaksperiodevisning(periodeStatus)}
            <Aktivitetsplikt />
            <Footer />
        </>
    );
};

export default Vilkår;
