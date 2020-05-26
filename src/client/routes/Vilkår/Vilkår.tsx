import React, { ReactNode, useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { PersonContext } from '../../context/PersonContext';
import styled from '@emotion/styled';
import { BehandletVedtaksperiode, BehandletVedtaksperiodeFraInfotrygd } from './BehandletVedtaksperiode';
import { PåfølgendeVedtaksperiode, PåfølgendeVedtaksperiodeFraInfotrygd } from './PåfølgendeVedtaksperiode';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';
import Aktivitetsplikt from './Aktivitetsplikt';
import { Vilkårstype } from '../../context/mapping/vilkårsmapper';
import { UbehandletVedtaksperiode, UbehandletVedtaksperiodeFraInfotrygd } from './UbehandletVedtaksperiode';
import { Vedtaksperiode } from '../../context/types.internal';
import { useVilkår, VurderteVilkår } from '../../hooks/useVilkår';

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

interface VanligeVilkårProps {
    periodestatus: VedtaksperiodeStatus;
    aktivVedtaksperiode: Vedtaksperiode;
    førsteVedtaksperiode: Vedtaksperiode;
    vilkår: VurderteVilkår;
}

const VanligeVilkår = ({ periodestatus, aktivVedtaksperiode, førsteVedtaksperiode, vilkår }: VanligeVilkårProps) => {
    const { ikkeOppfylteVilkår, oppfylteVilkår, ikkeVurderteVilkår } = vilkår;
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
                />
            );
    }
};

const InfotrygdVilkår = ({ periodestatus, aktivVedtaksperiode, førsteVedtaksperiode, vilkår }: VanligeVilkårProps) => {
    const { ikkeOppfylteVilkår, oppfylteVilkår, ikkeVurderteVilkår } = vilkår;
    switch (periodestatus) {
        case VedtaksperiodeStatus.Behandlet:
            return (
                <BehandletVedtaksperiodeFraInfotrygd
                    aktivVedtaksperiode={aktivVedtaksperiode}
                    førsteVedtaksperiode={førsteVedtaksperiode}
                />
            );
        case VedtaksperiodeStatus.Ubehandlet:
            return (
                <UbehandletVedtaksperiodeFraInfotrygd
                    ikkeOppfylteVilkår={ikkeOppfylteVilkår.map(tilKomponent)}
                    oppfylteVilkår={oppfylteVilkår
                        .filter(
                            (vilkår) =>
                                vilkår.type! in [Vilkårstype.Opptjeningstid, Vilkårstype.KravTilSykepengegrunnlag]
                        )
                        .map(tilKomponent)}
                    ikkeVurderteVilkår={ikkeVurderteVilkår}
                />
            );
        case VedtaksperiodeStatus.Påfølgende:
            return (
                <PåfølgendeVedtaksperiodeFraInfotrygd
                    ikkeOppfylteVilkår={ikkeOppfylteVilkår.filter(filtrerBehandledeVilkår).map(tilKomponent)}
                    oppfylteVilkår={oppfylteVilkår.filter(filtrerBehandledeVilkår).map(tilKomponent)}
                    ikkeVurderteVilkår={ikkeVurderteVilkår}
                />
            );
    }
};

const Vilkår = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const periodeStatus = useVedtaksperiodestatus();
    const vilkår = useVilkår();
    const forlengelseFraInfotrygd = aktivVedtaksperiode?.forlengelseFraInfotrygd;

    if (!aktivVedtaksperiode || vilkår === undefined || personTilBehandling === undefined) return null;

    const førsteVedtaksperiode = finnFørsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling!);
    return (
        <>
            {periodeStatus &&
                (forlengelseFraInfotrygd ? (
                    <InfotrygdVilkår
                        vilkår={vilkår}
                        periodestatus={periodeStatus}
                        aktivVedtaksperiode={aktivVedtaksperiode}
                        førsteVedtaksperiode={førsteVedtaksperiode}
                    />
                ) : (
                    <VanligeVilkår
                        vilkår={vilkår}
                        periodestatus={periodeStatus}
                        aktivVedtaksperiode={aktivVedtaksperiode}
                        førsteVedtaksperiode={førsteVedtaksperiode}
                    />
                ))}
            <Aktivitetsplikt />
            <Footer />
        </>
    );
};

export default Vilkår;
